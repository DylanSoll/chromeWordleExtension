"use strict"

//constant variables
const messages = ['Hacker', 'Excellent', 'Good Guess', 'Good Guess', 'Nice', 'Phew'];
chrome.storage.local.get(['game', 'settings'],(result)=>{
    //runs on launch
    create_wordle_map();
    var letter_pos = "0-0";
    if (result['game']){
        var game = result['game'];
        var word = game['word'];
        var can_type = game['can_type'];
        var guesses = game['guesses'];

        for (var iter = 0; iter < guesses.length; iter++){
            for (var letter = 0; letter < 5; letter++){
                document.getElementById(`ws-${iter}-${letter}`).innerHTML = guesses[iter][letter];
            };
            check_word(word, iter, false);
            letter_pos = update_row(letter_pos);
        }
    }else{

        //will run if no storage
        var word = random_word();
        chrome.storage.local.set({'game':{'word': word, 
        'guesses': [], 'can_type': true}}, function(){});
        clear_stats();
        var can_type = true;
        var guesses = [];
    }  

    console.log(word);
    var settings = result.settings;
    if (result['settings'] == undefined){
        settings = clear_settings().settings;
    }
    const colour_settings = settings.colours; 
    var custom = colour_settings.custom_mode;
    allow_stats = settings.statistics.allow_stats;


    if (allow_stats){
        document.getElementById('toggle_statistics').setAttribute('checked', true);
    }else{
        document.getElementById('toggle_statistics').removeAttribute('checked');
    }

    show_selected_btn(`ws_to_${colour_settings.active}`);
    convert_obj_to_style(colour_settings[colour_settings.active]);
    
    //key controls that involve wordle inputs
    document.addEventListener('keyup', function(e){
        var row = parseInt(letter_pos.split('-')[0]);
        if (row == 6) return
        var key = String(e.key);
        var active_square = document.getElementById("ws-"+letter_pos);
        if (!can_type) return;
        if (key == 'Backspace'){
            active_square.innerHTML = "";
            letter_pos = update_square(letter_pos, "-");
            return;
        }
        if (key.match(/[a-z]/i) && key.length == 1){
            active_square.innerHTML = key.toUpperCase();
            letter_pos = update_square(letter_pos, "+");
            return;
        }if (key == "Enter"){

            if (letter_pos.split('-')[1] != 4) return;

            active_square.className = "wordle-square ws-default";
            var valid_guess_results = validate_guess(row);
            const valid_guess = valid_guess_results[0]; const guess = valid_guess_results[1];
            if (!valid_guess) return;
            const correct = check_word(word, row);
            if (correct){
                use_message_box(messages[row]);
                can_type = false;
                if (allow_stats){
                    chrome.storage.local.get(['statistics'], function(result){
                        result['statistics']['distribution'][row + 1] += 1;
                        chrome.storage.local.set({'statistics': result['statistics']});
                    });
                }
            }else{
                
                letter_pos = update_row(letter_pos);
                if (letter_pos != '6-0'){
                    reset_guesses(word);
                    active_square = document.getElementById("ws-"+letter_pos);
                    active_square.className = "wordle-square ws-default ws-active";
                }else{
                    use_message_box(word);
                }
                row +=1;
            }

            
            guesses.push(guess.toUpperCase());
            chrome.storage.local.set({'game':{'word':word, 'guesses': guesses, 'can_type': can_type}});

            if (row == 6){
                use_message_box(word);
                if (allow_stats){
                    chrome.storage.local.get(['statistics'], function(result){
                        result['statistics']['distribution']['failed'] += 1;
                        chrome.storage.local.set({'statistics': result['statistics']});
                    });
                }
                
            }
            return;
            
        } 
        
        if (key == "ArrowLeft"){
            letter_pos = update_square(letter_pos, "-");
            return;
        }
        
        if (key == "ArrowRight"){
            if (active_square.innerHTML.length == 0){
                active_square.innerHTML = "-";
            }
            letter_pos = update_square(letter_pos, "+");
            return;
        }
        return
    });


    document.getElementById('start_new_game').addEventListener('click', ()=>{
        word = random_word()
        document.getElementById('ws_dialog_box').setAttribute('hidden', true);
        chrome.storage.local.set({'game':{'word': word, 
        'guesses': [], 'can_type': true}}, function(){})
        can_type = true;
        guesses = [];
        letter_pos = "0-0";
        create_wordle_map();
        document.getElementById('start_new_game').blur()
        if (allow_stats){
            chrome.storage.local.get(['statistics'], function(result){
                result['statistics']['games_played'] += 1;
                chrome.storage.local.set({'statistics': result['statistics']});
            });
        }
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
document.getElementById('full_reset').addEventListener('click', full_reset)
document.getElementById('open_stats').addEventListener('click', open_stats); //open stats box
document.getElementById('open_settings').addEventListener('click', open_settings);

document.getElementById('clear_stats').addEventListener('click', clear_stats);

document.getElementById('dismiss-dialog').addEventListener('click', 
()=>document.getElementById('ws_dialog_box').hidden =true);

document.getElementById('ws_to_light_mode').addEventListener('click', ws_to_light_mode);

document.getElementById('ws_to_dark_mode').addEventListener('click', ws_to_dark_mode);

document.getElementById('reset_colour_settings').addEventListener('click', reset_colour_settings);

document.getElementById('save_colour_settings').addEventListener('click', save_colour_settings);

document.getElementById('toggle_statistics').addEventListener('input', toggle_statistics);

document.getElementById('open_colour_settings').addEventListener('click', open_colour_settings);

document.getElementById('open_animations_settings').addEventListener('click', open_animations_settings);

document.getElementById('back_to_main_settings').addEventListener('click', back_to_main_settings)