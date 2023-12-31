// Storage Box
let board = document.getElementsByClassName("board")[0];
let currentRow = 0;
let currentCol = 0;
let ToGuess = 'CREED';
let stopGame = false;
let loading = 0;

function handleloader(){
    let choices = ['none', 'flex'];
    document.getElementsByClassName('board')[0].style.display = choices[+loading];
    document.getElementById('loader').style.display = choices[+(!loading)];
    loading = +(!(loading));
}

async function init() {
    handleloader();
    await sleep(1000);
    handleloader();
}

// Keyboard Bindings
window.addEventListener('keyup', function(event) {
    if (stopGame == true){
        return
    }
    if (event.key === "Backspace"){
        clearField(board.children[currentRow]);
    }

    else if (event.key === "Enter"){
        getWord(board.children[currentRow]);
    }

    const match = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", key = event.key.toLocaleUpperCase();
    if (match.includes(key)){
        return updateField(board.children[currentRow], key)
    }
});


// Logical Methods

// Clearing Fields
function clearField(row){
    for (let idx = row.childElementCount-1; idx>=0; idx--){
        const cell = row.children[idx];
        const para = cell.children[0];
        if (para.textContent != '') {
            para.textContent = '';
            cell.style.borderColor = '#3a3a3c';
            cell.classList.remove("animate__bounceIn");
            cell.style.setProperty('--animate-duration', '0.5s');
            currentCol -= 1;
            break;
        }
    }
}

// Updating fields with the given character
function updateField(row, char){
    let count = 0;
    for (let cell of row.children){
        currentCol = count;
        const para = cell.children[0];
        if (para.textContent == '') {
            para.textContent = char;
            cell.style.borderColor = '#565758';
            cell.classList.add('animate__bounceIn')
            cell.style.setProperty('--animate-duration', '0.5s');
            break;
        }
        count += 1;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Cell transition
function transit(cell, color){
    cell.style.borderColor = (`var(${color})`);
    cell.style.setProperty('background-color', `var(${color})`);
    cell.classList.add('animate__flipInX');
    cell.style.setProperty('--animate-duration', '1.5s');
}

function IsComplete(){
    if (currentCol < 4){
        return false
    }
    else{
        currentCol = 0;
        return true
    }
}

function removeChar(word, char, pos=-1){
    if (pos == -1) return (word.slice(0, word.indexOf(char)))+'*'+(word.slice(word.indexOf(char)+1, word.length))
    return (word.slice(0, pos)+'*'+(word.slice(pos+1, word.length)));
}

async function getWord(row){
    let word = '';
    let out = ['','', '', '', ''];

    if (!IsComplete()){
        alert("Please complete the word!");
        return;
    }
    for (idx = 0; idx < row.childElementCount; idx++){
        let cell = row.children[idx];
        word += cell.textContent;
    }
    if (word == ToGuess) { 
        stopGame = true;
        out = ['--color-correct', '--color-correct', '--color-correct', '--color-correct', '--color-correct'];
    }
    else{
        for (let pos in ToGuess){
            if (ToGuess[pos] == word[pos]){
                out[pos] = '--color-correct';
                word = removeChar(word, "*", +pos);
            }
            else if(word.includes(ToGuess[pos])){ 
                out[word.indexOf(ToGuess[pos])] = '--color-present';
                word = removeChar(word, word[word.indexOf(ToGuess[pos])]);                
            }
        }
    }

    
    for (ch in out){
        let cell = row.children[ch];
        if (out[ch] == '') transit(cell, '--color-absent'); 
        else transit(cell, out[ch])
        await sleep(300);
    }

    if (stopGame) {
        alert("Right Answer!!!")
        return
    };

    currentRow += 1;

    if (currentRow > 5){
        alert("Better luck next time! The word was: "+ToGuess);
        stopGame = true;
        return
    }

}

init();