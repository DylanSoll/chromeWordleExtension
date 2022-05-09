//definitions
function reset(){
    letter_pos = "0-0";
    can_type = true;
}
function random_assign(){
    return Math.floor(8916*Math.random());
    
}

function reset_guesses(word){
    for (var let_pos = 0; let_pos <=4; let_pos++){
        var letters_guess = Object.keys(letter_occur);
        if (letters_guess.includes(word[let_pos])){
            letter_occur[word[let_pos]] += 1;
        }else{
            letter_occur[word[let_pos]] = 1;
        }
    }
    return letter_occur
}


//functions
function update_column(letter_pos, direction = "+"){
    var row = parseInt(letter_pos.split('-')[0]); //creates a row variable from the letter pos
    var column = parseInt(letter_pos.split('-')[1]); //same for the column
    if (direction == "+"){ //
        if (column != 4){
            column += 1;
        }
    }else if (direction == "-"){
        if (column > 0){
            column -= 1;
        }
    }
    return String(row) + "-" + String(column)
}
function update_row(letter_pos){
    var row = parseInt(letter_pos.split('-')[0]);
    var column = 0;
    row += 1;
    return String(row) + "-" + String(column)
}
function update_square(letter_pos, direction){
    var active_square = document.getElementById("ws-"+letter_pos);
    active_square.className = "wordle-square ws-default";
    letter_pos = update_column(letter_pos, direction);
    active_square = document.getElementById("ws-"+letter_pos);
    active_square.className = "wordle-square ws-default ws-active";
    return letter_pos;
}

function validate_guess(row){
    var valid = false; var guess = "";
    for (var col = 0; col <=4; col++){
        const square = document.getElementById("ws-"+String(row)+"-"+String(col));
        if (square.innerHTML != "-"){
            guess += square.innerHTML.toLowerCase();
        }
    }
    if (guess.length == 5){
        
        if (words_array_file.includes(guess)){
            valid = true;
        }
    }return [valid, guess]
}


function create_wordle_map(){
    document.getElementById('wordle_parent'). innerHTML =""
    for (var row = 0; row < 6; row++){
        for (squarePos = 0; squarePos < 5; squarePos++){
            square = document.createElement('div');
            square.type = "text";
            if (row == 0 && squarePos == 0){
                square.className = "wordle-square ws-default ws-active";
            }else{
                square.className = "wordle-square";
            }
            square.id = "ws-"+String(row) + "-"+String(squarePos);
            document.getElementById("wordle_parent").appendChild(square);
        }
        
    }
    return;
}


function check_word(word, row){
    correct = false;
    word_guess = "";
    letters_guessed = [];
    letter_occur = reset_guesses(word);
    for (var col = 0; col <=4; col++){
        square = document.getElementById("ws-"+String(row)+"-"+String(col))
        word_guess += square.innerHTML;
        
    }
    if (word_guess == word){
        correct = true;
        for (var col = 0; col <= 4; col++){
            square = document.getElementById("ws-"+String(row)+"-"+String(col))
            square.className = "wordle-square ws-correct";
        }
    }else{
        
        for (var col = 0; col <=4; col++){
            square = document.getElementById("ws-"+String(row)+"-"+String(col))
            letter = square.innerHTML
            if (word.includes(letter)){
                if (letter_occur[letter] > 0 ){
                    if (word[col] == letter){
                        square.className = "wordle-square ws-correct";
                    }else{
                        square.setAttribute("class", "wordle-square ws-partial")
                    }
                    letter_occur[letter] -= 1
                }else{
                    if (!square.className.includes('ws-correct'))
                    square.className = "wordle-square ws-incorrect"
                }
            }else if (square.className != "wordle-square ws-correct"){
                square.className = "wordle-square ws-incorrect"
            }
        }
    }
    return correct
}

function use_message_box(message){
    message_box = document.getElementById('ws_message_box');
    message_box.removeAttribute('hidden');
    message_box.innerHTML = message;
    window.setTimeout(function(){message_box.setAttribute('hidden', true)}, 5000);
}

chrome.storage.local.get('game',function(result){
    create_wordle_map();
    letter_occur = {};
    letter_pos = "0-0";
    if (result['game']){
        game = result['game'];
        word = game['word'];
        console.log(word);
        can_type = game['can_type'];
        guesses = game['guesses'];
        for (var iter = 0; iter < guesses.length; iter++){
            for (var letter = 0; letter < 5; letter++){
                console.log(iter);
                document.getElementById('ws-'+iter+"-"+letter).innerHTML = guesses[iter][letter];
            }
            correct = check_word(word, iter);
            letter_pos = update_row(letter_pos);
        }
    }else{
        word = words_array_file[random_assign()].toUpperCase();
        chrome.storage.local.set({'game':{'word': word, 
        'guesses': [], 'can_type': true}}, function(){});

        statistics = {'games_played': 1, 'distribution': 
        {'failed': 0, '1':0, '2':0, '3':0, '4':0, '5':0, '6':0}};
        chrome.storage.local.set({'statistics': statistics});

        can_type = true;
        guesses = [];
        letter_pos = "0-0";
    }   



    document.addEventListener('keyup', function(e){
        var key = String(e.key);
        active_square = document.getElementById("ws-"+letter_pos);
        row = letter_pos.split('-')[0];
        if (row < 6){
            if (key == 'Backspace'){
                active_square.innerHTML = "";
                letter_pos = update_square(letter_pos, "-")
            }else if (key.match(/[a-z]/i) && key.length == 1 && can_type){
                active_square.innerHTML = key.toUpperCase();
                letter_pos = update_square(letter_pos, "+")
            }else if (key == "Enter"){
                if (letter_pos.split('-')[1] == 4){
                    active_square.className = "wordle-square ws-default";
                    var valid_guess_results = validate_guess(row);
                    var valid_guess = valid_guess_results[0]; guess = valid_guess_results[1]
                    if (valid_guess){
                        
                        correct = check_word(word, row)
                        if (correct){
                            if (row == 0){
                                message = 'Hacker'
                            }else if (row < 3){
                                message = 'Good Guess'
                            }else if (row = 4){
                                message = 'Close'
                            }else{
                                message = "Phew"
                            }
                            use_message_box(message)
                            can_type = false
                            chrome.storage.local.get(['statistics'], function(result){
                                result['statistics']['distribution'][parseInt(row)+1] += 1
                                chrome.storage.local.set({'statistics': result['statistics']})
                            })
                        }else{
                            
                            letter_pos = update_row(letter_pos);
                            if (letter_pos != '6-0'){
                                reset_guesses(word);
                                active_square = document.getElementById("ws-"+letter_pos);
                                active_square.className = "wordle-square ws-default ws-active";
                            }else{
                                use_message_box(word)
                            }
                        }
                        row +=1
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
                        }else{
                        }
                    }
                }
            }else if (key == "ArrowLeft"){
                letter_pos = update_square(letter_pos, "-")
            }else if (key == "ArrowRight"){
                if (active_square.innerHTML.length == 0){
                    active_square.innerHTML = "-"
                }
                letter_pos = update_square(letter_pos, "+")
            }
        }else{
            
        }
        
    });
    document.getElementById('start_new_game').addEventListener('click', function(){
        word = words_array_file[random_assign()].toUpperCase()
        chrome.storage.local.set({'game':{'word': word, 
        'guesses': [], 'can_type': true}}, function(){})
        can_type = true;
        guesses = [];
        letter_pos = "0-0"
        create_wordle_map();
        document.getElementById('start_new_game').blur()
        chrome.storage.local.get(['statistics'], function(result){
            result['statistics']['games_played'] += 1
            chrome.storage.local.set({'statistics': result['statistics']})
            
        })
        document.getElementById('start_new_game').blur()
    })
    document.getElementById('open_stats').addEventListener('click', function(){
        chrome.storage.local.get(['statistics'], function(result){
            document.getElementById('ws_stats_box').removeAttribute('hidden')
            stats = result['statistics']
            console.log(stats)
            var total_won = 0;
            for (var pos = 1; pos < 7; pos++){
                document.getElementById('correct-in-'+pos+'-stats').innerHTML = stats['distribution'][pos]
                total_won += parseInt(stats['distribution'][pos])
            }
            document.getElementById('games-won').innerHTML =  total_won + "/" + String(stats['games_played'])
        })
    })
    
});


document.getElementById('dismiss-stats').addEventListener('click', function(){document.getElementById('ws_stats_box').setAttribute('hidden', true)})




