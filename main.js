"use strict"
//constant variables
const messages = ['Hacker', 'Excellent', 'Good Guess', 'Good Guess', 'Nice', ' Phew'];
//clear_settings();
chrome.storage.local.get(['game', 'settings'],(result)=>{
    console.log(result.settings)
    create_wordle_map();
    var letter_pos = "0-0";
    if (result['game']){
        var game = result['game'];
        var word = game['word'];
        var can_type = game['can_type'];
        var guesses = game['guesses'];
        for (var iter = 0; iter < guesses.length; iter++){
            var letter_occur = reset_guesses(word);
            for (var letter = 0; letter < 5; letter++){
                document.getElementById('ws-'+iter+"-"+letter).innerHTML = guesses[iter][letter];
            }
            check_word(word, iter);
            letter_pos = update_row(letter_pos);
        }
    }else{
        var word = random_word();
        chrome.storage.local.set({'game':{'word': word, 
        'guesses': [], 'can_type': true}}, function(){});
        clear_stats();
        var can_type = true;
        var guesses = [];
    }   
    var settings = result.settings;
    if (!settings){
        settings = clear_settings();
    }
    const colour_settings = settings['colours']; 
    var custom = colour_settings['custom_mode']
    console.log(`ws_to_${colour_settings['active']}`);
    show_selected_btn(`ws_to_${colour_settings['active']}`)
    console.log(custom)
    convert_obj_to_style(colour_settings[colour_settings['active']])
    var letter_occur = reset_guesses(word);
    
    //key controls that involve wordle inputs
    document.addEventListener('keyup', function(e){
        var row = parseInt(letter_pos.split('-')[0]);
        if (row == 6) return
        var key = String(e.key);
        var active_square = document.getElementById("ws-"+letter_pos);
        if (key == 'Backspace' && can_type){
            active_square.innerHTML = "";
            letter_pos = update_square(letter_pos, "-");
        }else if (key.match(/[a-z]/i) && key.length == 1 && can_type){
            active_square.innerHTML = key.toUpperCase();
            letter_pos = update_square(letter_pos, "+");
        }else if (key == "Enter"){
            if (letter_pos.split('-')[1] == 4){
                active_square.className = "wordle-square ws-default";
                var valid_guess_results = validate_guess(row);
                const valid_guess = valid_guess_results[0]; const guess = valid_guess_results[1];
                if (valid_guess){
                    const correct = check_word(word, row);
                    if (correct){
                        var message = messages[row];
                        use_message_box(message);
                        can_type = false;
                        
                        chrome.storage.local.get(['statistics'], function(result){
                            result['statistics']['distribution'][row] += 1;
                            console.log(result['statistics']['distribution']);
                            chrome.storage.local.set({'statistics': result['statistics']});
                        });
                    }else{
                        
                        letter_pos = update_row(letter_pos);
                        if (letter_pos != '6-0'){
                            reset_guesses(word);
                            active_square = document.getElementById("ws-"+letter_pos);
                            active_square.className = "wordle-square ws-default ws-active";
                        }else{
                            use_message_box(word);
                        }
                    }
                    row +=1;
                    guesses.push(guess.toUpperCase());
                    chrome.storage.local.set({'game':{'word':word, 'guesses': guesses, 'can_type': can_type}});
                    chrome.storage.local.get('game', function(result){
                        console.log(result.game);
                    });
                    if (row == 6){
                        use_message_box(word);
                        chrome.storage.local.get(['statistics'], function(result){
                            result['statistics']['distribution']['failed'] += 1;
                            chrome.storage.local.set({'statistics': result['statistics']});
                        });
                    }
                }
            }
        }else if (key == "ArrowLeft" && can_type){
            letter_pos = update_square(letter_pos, "-");
        }else if (key == "ArrowRight" && can_type){
            if (active_square.innerHTML.length == 0){
                active_square.innerHTML = "-";
            }
            letter_pos = update_square(letter_pos, "+");
        }
    });


    document.getElementById('start_new_game').addEventListener('click', function(){
        word = random_word()
        document.getElementById('ws_dialog_box').setAttribute('hidden', true);
        chrome.storage.local.set({'game':{'word': word, 
        'guesses': [], 'can_type': true}}, function(){})
        can_type = true;
        guesses = [];
        letter_pos = "0-0";
        create_wordle_map();
        document.getElementById('start_new_game').blur()
        chrome.storage.local.get(['statistics'], function(result){
            result['statistics']['games_played'] += 1;
            chrome.storage.local.set({'statistics': result['statistics']});
        });
        document.getElementById('start_new_game').blur();
    })


    


    var colour_inputs = document.getElementById('custom_colour_container').getElementsByTagName('input');
    for (var elem = 0; elem < colour_inputs.length; elem++){
        const input = colour_inputs[elem];
        input.value = custom[input.getAttribute('data-target')]
        input.addEventListener('input', function(){
            show_selected_btn('ws_to_custom_mode');
            const target = input.getAttribute('data-target');
            const value = input.value;
            custom[target] = value;
            convert_obj_to_style(custom);
        });
    }
    document.getElementById('ws_to_custom_mode').addEventListener('click', function(){
        show_selected_btn('ws_to_custom_mode');
        convert_obj_to_style(custom);
    });
    
});

document.getElementById('open_stats').addEventListener('click', open_stats); //open stats box
document.getElementById('open_settings').addEventListener('click', open_settings);
document.getElementById('ws_colour_settings_btn').addEventListener('click', ws_colour_settings_btn);
document.getElementById('ws_stats_settings_btn').addEventListener('click', ws_stats_settings_btn);
document.getElementById('ws_stats_back').addEventListener('click', ws_stats_back);
document.getElementById('ws_colour_back').addEventListener('click', ws_colour_back);

document.getElementById('clear_stats').addEventListener('click', clear_stats);

document.getElementById('dismiss-dialog').addEventListener('click', 
()=>document.getElementById('ws_dialog_box').hidden =true);

document.getElementById('ws_to_light_mode').addEventListener('click', ws_to_light_mode);

document.getElementById('ws_to_dark_mode').addEventListener('click', ws_to_dark_mode);

document.getElementById('reset_colour_settings').addEventListener('click', reset_colour_settings)

document.getElementById('save_colour_settings').addEventListener('click', save_colour_settings)



