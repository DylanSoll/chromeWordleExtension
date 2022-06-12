const NUMBER_OF_WORDS = 8915 //number of 5 letter words

function random_word(){
    const word_pos = Math.floor(NUMBER_OF_WORDS * Math.random());
    //generates a random int 
    const rand_word = words_array_file[word_pos].toUpperCase();
    //uses that to get a random word in uppercase
    return rand_word
}

function reset_guesses(word){
    let letter_occur = {};
    //create a blank object for the letter frequency
    for (let let_pos = 0; let_pos <=4; let_pos++){
        //runs through all the letters
        const letter = word[let_pos];
        //saves letter
        if (letter in letter_occur){
            letter_occur[letter] += 1;
            //adds 1 to occurance 
            continue; //skip rest of the loop
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
    let active_square = document.getElementById("ws-"+letter_pos);
    active_square.className = "wordle-square ws-default";
    letter_pos = update_column(letter_pos, direction);
    active_square = document.getElementById("ws-"+letter_pos);
    active_square.className = "wordle-square ws-default ws-active";
    return letter_pos;
}

function validate_guess(row){
    let valid = false; let guess = "";
    let guess_elements = [];
    for (let col = 0; col <=4; col++){
        const square = document.getElementById("ws-"+String(row)+"-"+String(col));
        guess_elements.push(square)
        if (square.innerHTML != "-"){
            guess += square.innerHTML.toLowerCase();
        }
    }
    if (guess.length == 5){
        if (words_array_file.includes(guess)){
            valid = true;
        }
    else{
        for (let square_pos = 0; square_pos < guess_elements.length; square_pos++){
            const square = guess_elements[square_pos];
            square.className += ' invalid-word'
            if (square_pos == 4){
                setTimeout(()=>{square.className = "wordle-square ws-active"}, 250)
            }else{
                setTimeout(()=>{square.className = "wordle-square ws-default"}, 250)
            }
        }
    }
    }return [valid, guess]
}


function create_wordle_map(){
    //creates the grid for the wordle play area
    document.getElementById('wordle_parent').innerHTML ="";
    //creates the parent dive
    for (var row = 0; row < 6; row++){ //needs to be 6 rows
        for (var squarePos = 0; squarePos < 5; squarePos++){
            const container = document.createElement('div');
            const square = document.createElement('div'); //creates a new div
            const hidden_square = document.createElement('div')
            if (row == 0 && squarePos == 0){ //if it is the first square
                square.className = "wordle-square ws-default ws-active standard"; //make it active
            }else{
                square.className = "wordle-square standard";
            }// else have as default
            container.style = `position: absolute; margin-left: ${squarePos*78}px; margin-top: ${row*78}px`
            container.id = "ws-"+String(row) + "-"+String(squarePos) + '-cont'
            hidden_square.className = "wordle-square hidden-square ws-correct"
            square.id = "ws-"+String(row) + "-"+String(squarePos); //creates the id
            square.style="position: absolute;"
            hidden_square.style="position: absolute;"
            hidden_square.id = "ws-"+String(row) + "-"+String(squarePos) + '-hidden'
            container.appendChild(square);
            container.appendChild(hidden_square)
            document.getElementById("wordle_parent").appendChild(container);

        }
    }
    return;
}




function check_word(word, row, live = true){
    let word_guess = "";
    const letter_occur = reset_guesses(word);
    let positionalGuess = [];
    for (var col = 0; col <=4; col++){
        const square = document.getElementById("ws-"+String(row)+"-"+String(col))
        word_guess += square.innerHTML;
        if (square.innerHTML == word[col]){
            positionalGuess.push(col);
            square.className = "wordle-square ws-correct";
            letter_occur[word[col]] -= 1;
        }
        
    }

    if (word_guess === word){
        for (var col = 0; col <= 4; col++){
            const square = document.getElementById(`ws-${String(row)}-${String(col)}`)
            const hidden_square = document.getElementById(`ws-${String(row)}-${String(col)}-hidden`);
            const square_cont = document.getElementById(`ws-${String(row)}-${String(col)}-cont`)
            square.className = "wordle-square ws-correct"; 
            
            if (live){
                square_cont.className = `whole-container-letter`
                square.className = `wordle-square standard`;
                hidden_square.className = `wordle-square ws-correct hidden-square`;
                hidden_square.innerHTML = square.innerHTML
            }
        }
        return true


    }else{
        for (var col = 0; col <=4; col++){
            const square = document.getElementById(`ws-${String(row)}-${String(col)}`)
            const hidden_square = document.getElementById(`ws-${String(row)}-${String(col)}-hidden`);
            const square_cont = document.getElementById(`ws-${String(row)}-${String(col)}-cont`)
            var letter = square.innerHTML
            square.innerHTML = letter
            hidden_square.innerHTML = letter
            
            if (positionalGuess.includes(col)){
                square.className = "wordle-square ws-correct"; 
                if (live){
                    square_cont.className = `whole-container-letter delay-${col}`
                    square.className = `wordle-square standard delay-${col}`;
                    hidden_square.className = `wordle-square ws-correct hidden-square delay-${col}`;
                }
            }
            else if (word.includes(letter)){
                if (letter_occur[letter] > 0 ){
                    if (word[col] !== letter){
                        square.className =  "wordle-square ws-partial"
                        if (live){
                            square_cont.className = `whole-container-letter delay-${col}`
                            square.className = `wordle-square standard delay-${col}`;
                            hidden_square.className = `wordle-square ws-partial hidden-square delay-${col}`;
                        }
                        letter_occur[letter] -= 1
                    }
                    
                }else{
                    square.className = "wordle-square ws-incorrect"
                    if (live){
                        square_cont.className = `whole-container-letter delay-${col}`
                        square.className = `wordle-square standard delay-${col}`;
                        hidden_square.className = `wordle-square ws-incorrect hidden-square delay-${col}`;
                    }
                }
            }else if (square.className != "wordle-square ws-correct"){
                square.className = "wordle-square ws-incorrect"
                if (live){
                    square_cont.className = `whole-container-letter delay-${col}`
                    square.className = `wordle-square standard delay-${col}`;
                    hidden_square.className = `wordle-square ws-incorrect hidden-square delay-${col}`;
                }
            }
        }
        return false
    }
}
