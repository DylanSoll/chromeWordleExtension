function random_word(){
    const word_pos = Math.floor(8916*Math.random());
    var rand_word = words_array_file[word_pos].toUpperCase();
    return rand_word
}

function reset_guesses(word){
    var letter_occur = {};
    for (var let_pos = 0; let_pos <=4; let_pos++){
        var letter = word[let_pos];
        if (letter in letter_occur){
            letter_occur[letter] += 1;
            continue;
        }
        letter_occur[letter] = 1;
    }
    return letter_occur;
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
    row += 1;
    return String(row) + "-" + String(0)
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
        for (var squarePos = 0; squarePos < 5; squarePos++){
            const square = document.createElement('div');
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
    var correct = false;
    var word_guess = "";
    var letters_guessed = [];
    var letter_occur = reset_guesses(word);
    for (var col = 0; col <=4; col++){
        const square = document.getElementById("ws-"+String(row)+"-"+String(col))
        word_guess += square.innerHTML;
        if (square.innerHTML == word[col]){
            square.className = "wordle-square ws-correct";
            letter_occur[word[col]] -= 1;
        }
        
    }
    if (word_guess == word){
        correct = true;
        for (var col = 0; col <= 4; col++){
            const square = document.getElementById("ws-"+String(row)+"-"+String(col))
            square.className = "wordle-square ws-correct";
        }
    }else{
        for (var col = 0; col <=4; col++){
            const square = document.getElementById("ws-"+String(row)+"-"+String(col))
            var letter = square.innerHTML
            if (word.includes(letter)){
                if (letter_occur[letter] > 0 ){
                    if (word[col] != letter){
                        square.setAttribute("class", "wordle-square ws-partial")
                        letter_occur[letter] -= 1
                    }
                    
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