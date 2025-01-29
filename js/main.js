'use strict'

const EMPTY = ' '
const MINE = '💣'
const MARKED = '🚩'
const LOSE = '🤯'
const VICTORY = '😎'
const START = '😊'
const EXPLODE = '💥'
const HINT = '💡'

var gBoard

var gLevel = {
    SIZE: 0,
    MINES: 0,
    LIVES: 3,
}

var gGame = {
    isOn: false,
    coveredCount: 0,
    MarkedCount: 0,
    secsPassed: 0,
}

var gPlayer = {
    lives: 0,
    hits: 0,
    hints: 0,
}

var gCounter


// Timer:
var gInterval
var gStartTime
var gPausedTime


function onInit() {
    resetTimer()
    gGame.isOn = false
    gGame.MarkedCount = 0
    updateLives(gLevel.LIVES)
    gPlayer.hits = 0
    emojiButton()
    gBoard = buildBoard(4)
    // gBoard[0][0].isMine = true
    // gBoard[0][1].isMine = true
    renderBoard(gBoard)
    renderMineCount()
}

function placeRandomMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        const emptyCells = getEmptyCells(board)
        const idx = getRandomIntInclusive(0, emptyCells.length - 1)

        const randMineLocation = emptyCells[idx]
        if (!randMineLocation) return

        board[randMineLocation.i][randMineLocation.j] = { //Modal
            minesAroundCount: null,
            isCovered: true,
            isMine: true,
            isMarked: false,
        }
    }
}

function renderCells(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMarked) {
                continue
            }
            if (board[i][j].isMine) {
                renderCell({ i, j }, MINE) //DOM
            } else renderCell({ i, j }, board[i][j].minesAroundCount) //DOM
        }
    }
}

function buildBoard(size) {
    switch (size) {
        case 4:
            gLevel.SIZE = size
            gLevel.MINES = 2
            gGame.coveredCount = size ** 2
            gPlayer.lives = 3
            break;
        case 8:
            gLevel.SIZE = size
            gLevel.MINES = 14
            gGame.coveredCount = size ** 2
            gPlayer.lives = 3
            break;
        case 12:
            gLevel.SIZE = size
            gLevel.MINES = 32
            gGame.coveredCount = size ** 2
            gPlayer.lives = 3
            break;
        default:
            break;
    }


    var board = createMat(gLevel.SIZE, gLevel.SIZE)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = {
                minesAroundCount: null,
                isCovered: true,
                isMine: false,
                isMarked: false,
            }
        }
    }



    return board
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countNeighbors(i, j, board)
        }
    }
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })

            if (currCell.isCovered) cellClass += ' covered'
            if (currCell.isMarked) cellClass += ' marked'

            // strHTML += `\t<td class="cell ' ${cellClass} onclick="onCellClicked($)" >\n`
            // strHTML += `<td class="cell ${cellClass}" onclick="onCellClicked(${elCell},${i},${j})>lala</td>`
            strHTML += '\t<td class="cell ' + cellClass + '"  onclick="onCellClicked(' + 'event' + ',' + i + ',' + j + ')" >\n'

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    const elBoard = document.querySelector('.board-container tbody')
    elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    if (isGameOver()) {
        return
    }
    if (gBoard[i][j].isMarked) return 

    startTimer()
    if (!gGame.isOn && gGame.MarkedCount === 0) {  //FIRST CLICK PLACING MINES
        gGame.isOn = !gGame.isOn
        placeRandomMines(gBoard)
        setMinesNegsCount(gBoard)
        renderCells(gBoard)
    }

    if (gBoard[i][j].isCovered && !gBoard[i][j].isMarked) gGame.coveredCount--
    gBoard[i][j].isCovered = false //Modal  IF NOT FIRST CLICK
    document.querySelector(`.cell-${i}-${j}`).classList.remove('covered') //DOM

    if (gBoard[i][j].isMine) {  //WHEN CLICKING ON CELL WITH MINE
        console.log('Mine!')

        gPlayer.lives-- //MODAL REMOVE LIVES
        updateLives(gPlayer.lives) // DOM

        if (isGameOver()) {
            console.log(gPlayer.lives)
            stopTimer()
            emojiButton()  // IF YES, CHANGE EMOJI
            exposeAllMines(gBoard) // EXPOSE ALL MINES
            explode({i,j}, EXPLODE)
            gGame.isOn = false

        } else {
            setTimeout(() => {
                gBoard[i][j].isCovered = true //MODAL - IF NOT GAME OVER RE-COVER MINE
                document.querySelector(`.cell-${i}-${j}`).classList.add('covered') //DOM 
            }, 2000);

        }



        // if (!gPlayer.lives) {
        //     if (isGameOver()) {  //CHECK IF GAME OVER
        //         emojiButton()  // IF YES, CHANGE EMOJI
        //         exposeAllMines(gBoard) // EXPOSE ALL MINES
        //     }
        // }
        // console.log(gPlayer.lives)
    }

    if (isVictory()) {
        emojiButton()
        stopTimer()
    }

}

function isGameOver() {
    return gPlayer.lives ? false : true;
}


function onCellMarked(elCell, prevElCell) {
    if (!gGame.isOn && (isVictory() || isGameOver())) return
    if (gGame.isGameOver) return
    if (gGame.MarkedCount >= gLevel.MINES) return
    if (!gBoard[elCell[1]][elCell[2]].isCovered) return
    
    if (!gBoard[elCell[1]][elCell[2]].isMarked) {
        gBoard[elCell[1]][elCell[2]].isMarked = true //MODAL
        gGame.MarkedCount++
        var elCellContent = document.querySelector(`.cell-${elCell[1]}-${elCell[2]}`)
        elCellContent.innerText = MARKED //DOM

        if (!gGame.isOn) {
            gGame.isOn = !gGame.isOn
            placeRandomMines(gBoard)
            setMinesNegsCount(gBoard)
            renderCells(gBoard)
        }

        gPlayer.hits = 0
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine && gBoard[i][j].isMarked) {
                    gPlayer.hits++
                }
            }
        }
    } else {
        console.log('is already marked')
        gBoard[elCell[1]][elCell[2]].isMarked = false //MODAL
        gGame.MarkedCount--
        var elCellContent = document.querySelector(`.cell-${elCell[1]}-${elCell[2]}`)
        console.log('elCellContent:', elCellContent)
        if (gBoard[elCell[1]][elCell[2]].isMine){
            elCellContent.innerHTML = '<span>' + MINE + '</span>'
        } else {
            elCellContent.innerHTML = '<span>' + gBoard[elCell[1]][elCell[2]].minesAroundCount + '</span>'
        }

    }
    if (isVictory()) {
        emojiButton()
        stopTimer()
    }
    renderMineCount()
}


function expandUncoveredBoard() {

}




function updateLives(lives) {
    var elLives = document.querySelector('.lives span')
    elLives.innerText = lives
}

document.addEventListener('contextmenu', function (event) {
    // Prevent the default context menu from appearing
    event.preventDefault();

    // Your code to handle the right-click event goes here

    var elCell = event.target.classList[1].split('-')
    var prevElCell = gBoard[elCell[1]][elCell[2]].isMine
    console.log(elCell)
    onCellMarked(elCell, prevElCell)

});


function emojiButton() {
    if (!gGame.isOn) {
        var emojiButton = START
    }
    else if (isGameOver()) {
        var emojiButton = LOSE
    }
    else if (isVictory()) {
        var emojiButton = VICTORY
    }
    var elEmoji = document.querySelector('button.reset')
    elEmoji.innerText = emojiButton
}

function exposeAllMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) {
                board[i][j].isCovered = false //MODAL
                document.querySelector(`.cell-${i}-${j}`).classList.remove('covered') //DOM
            }
        }
    }
}

function isVictory() {
    return (gPlayer.hits === gLevel.MINES && gGame.coveredCount === 0) ? true : false;
}   

function renderMineCount(){
    var elMines = document.querySelector('.mines span')
    elMines.innerText = gLevel.MINES - gGame.MarkedCount
    console.log('elMines:', elMines)
    console.log(' gLevel.MINES:',  gLevel.MINES)
}



function explode(location, value){
    renderCell(location, value)
}