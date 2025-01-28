'use strict'

const EMPTY = ' '
const MINE = '💣'
const MARKED = '🚩'
const LOSE = '🤯'
const WIN = '😎'
const START = '😊'

var gBoard

var gLevel = {
    SIZE: 0,
    MINES: 2,
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
}

var gCounter
var gCell = {

}

// Timer:
var gInterval
var gStartTime
var gPausedTime



//Called when page loads
function onInit() {
    gCounter = 0
    resetTimer()
    var elEmoji = document.querySelector('button.reset')
    elEmoji.innerText = START
    gGame.coveredCount = gLevel.SIZE ** 2
    gGame.MarkedCount = 0
    gGame.isOn = true
    gBoard = buildBoard(4)
    setMinesNegsCount(gBoard)

    renderBoard(gBoard)

    gPlayer.lives = gLevel.LIVES
    updateLives(gPlayer.lives)

    var elMines = document.querySelector('.mines span')
    elMines.innerText = gLevel.MINES



}


// Builds the board 
// Set some mines Call
// setMinesNegsCount() 
// Return the created board

function buildBoard(size) {
    switch (size) {
        case 4:
            gLevel.SIZE = size
            gLevel.MINES = 2
            break;
        case 8:
            gLevel.SIZE = size
            gLevel.MINES = 14
            break;
        case 12:
            gLevel.SIZE = size
            gLevel.MINES = 32
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

    placeMines(board)

    return board
}


function placeMines(board) {

    // STATIC MINES:
    board[2][1] = {
        minesAroundCount: null,
        isCovered: true,
        isMine: true,
        isMarked: false,
    }


    board[3][2] = {
        minesAroundCount: null,
        isCovered: true,
        isMine: true,
        isMarked: false,
    }

    // RANDOM MINES:


    //     for (var i = 0 ; i < gLevel.SIZE ; i++) {

    //     board[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)] = {
    //         minesAroundCount: null,
    //         isCovered: true,
    //         isMine: true,
    //         isMarked: false,
    //     }
    //     // var emptyCells = getEmptyCells(board) 
    //     // var randomCell = emptyCells[getRandomInt(0, gLevel.SIZE)]

    //     // board[randomCell.i][randomCell.j] = {
    //     //     minesAroundCount: null,
    //     //     isCovered: true,
    //     //     isMine: true,
    //     //     isMarked: false,
    //     // }

    // }
}

// Count mines around each cell
// and set the cell's
// minesAroundCount

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countNeighbors(i, j, board)
        }
    }
}

// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })

            if (currCell.isCovered === true) cellClass += ' covered'
            else if (currCell.isMarked === true) cellClass += ' marked'

            // strHTML += `\t<td class="cell ' ${cellClass} onclick="onCellClicked($)" >\n`
            // strHTML += `<td class="cell ${cellClass}" onclick="onCellClicked(${elCell},${i},${j})>lala</td>`
            strHTML += '\t<td class="cell ' + cellClass + '"  onclick="onCellClicked(' + 'event' + ',' + i + ',' + j + ')" >\n'



            if (currCell.isMine === false) {
                var cellContent = currCell.minesAroundCount ? currCell.minesAroundCount : EMPTY
                strHTML += '<span>' + cellContent + '</span>'
            } else if (currCell.isMine === true) {
                strHTML += '<span>' + MINE + '</span>'
            }
            // else if (currCell.minesAroundCount) {
            //     strHTML += '<span>' + currCell.minesAroundCount + '</span>'
            // }


            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    // console.log('strHTML is:')
    // console.log(strHTML)
    const elBoard = document.querySelector('.board-container tbody')
    elBoard.innerHTML = strHTML
}

//Called when a cell is clicked

function onCellClicked(ev, i, j) {
    if (gGame.isOn === false) return
    if (gPlayer.lives === 0) return
    if (gBoard[i][j].isMarked) return

    if (checkWin(gBoard)) {
        renderWin(gBoard)
    }

    // console.log(ev)
    if (gGame.MarkedCount === 0) {
        gGame.MarkedCount++
        gGame.isOn = true
        startTimer()
        document.querySelector(`.cell-${i}-${j}`).classList.remove('covered')
        gBoard[i][j].isCovered = false
        if (!isMine(gBoard, i, j)) {
            gGame.coveredCount--
        }


        expandUncoveredBoard(gBoard, null, i, j)
    }

    else if (gGame.isOn) {
        if (gBoard[i][j].isCovered === false) return
        document.querySelector(`.cell-${i}-${j}`).classList.remove('covered')
        gBoard[i][j].isCovered = false
        if (!isMine(gBoard, i, j)) {
            gGame.coveredCount--
        }
        expandUncoveredBoard(gBoard, null, i, j)


    }

    if (isMine(gBoard, i, j)) {
        updateLives(--gPlayer.lives)
        if (gPlayer.lives !== 0) {
            setTimeout(() => {
                document.querySelector(`.cell-${i}-${j}`).classList.add('covered')
            }, 1000);
        }

    }

    // console.log(ev.button)

    // if (ev.button === 2) {
    //     onCellMarked(elCell)
    //     console.log('right click')
    // }

    if (checkGameOver()) {
        var elLives = document.querySelector('.lives span')
        // elLives.innerHTML = 'Game Over!'
        resetTimer()
        var elTimer = document.querySelector('.timer span')
        elTimer.innerText = gPausedTime
        var elEmoji = document.querySelector('button.reset')
        elEmoji.innerText = LOSE
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine) {
                    document.querySelector(`.cell-${i}-${j}`).innerText = '💥'
                    document.querySelector(`.cell-${i}-${j}`).classList.remove('covered')
                }
            }
        }



    }


}

document.addEventListener('contextmenu', function (event) {
    // Prevent the default context menu from appearing
    event.preventDefault();

    // Your code to handle the right-click event goes here
    // console.log(event.target.classList[1])
    var elCell = event.target.classList[1].split('-')
    var prevElCell = gBoard[elCell[1]][elCell[2]].isMine

    // console.log(prevElCell)
    if (gBoard[elCell[1]][elCell[2]].isMarked) {
        gBoard[elCell[1]][elCell[2]].isMarked = false
        gGame.MarkedCount--
        if (gBoard[elCell[1]][elCell[2]].isMine) {
            gCounter--
        }
        var elCellContent = document.querySelector(`.cell-${elCell[1]}-${elCell[2]}`)
        if (prevElCell) {
            elCellContent.innerText = MINE
        }
        else {
            elCellContent.innerText = EMPTY
        }
        var elMines = document.querySelector('.mines span')
        // console.log(elMines.innerText)
        elMines.innerText++
    }
    // onCellMarked(elCell)
    else {
        var elMines = document.querySelector('.mines span')
        if (elMines.innerText <= 0) return
        elMines.innerText--
        gGame.MarkedCount++
        gBoard[elCell[1]][elCell[2]].isMarked = true
        if (gBoard[elCell[1]][elCell[2]].isMine) gCounter++
        var elCellContent = document.querySelector(`.cell-${elCell[1]}-${elCell[2]}`)
        // console.log(elCellContent)
        elCellContent.innerText = MARKED
        // checkWin(gBoard)
        // if (checkWin(gBoard)) {
        //     renderWin ()
        // }
    }
});



// Called when a cell is right-clicked See how you can hide the context menu on right click
// function onCellMarked(elCell) {
//     var elMines = document.querySelector('.mines span')
//     if (elMines.innerText <= 0) return
//     elMines.innerText--
//     gGame.MarkedCount++
// }

// The game ends when all mines are marked, and all the other cells are uncovered
function checkGameOver() {
    return !gPlayer.lives

}

function checkWin(board) {
    console.log(gCounter)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMarked && board[i][j].isMine) {
                console.log(gCounter)
                // gCounter++
                console.log(gCounter)
                if (gCounter === gLevel.MINES) return true

            }
        }
    } return false
    // return (gGame.coveredCount === gLevel.MINES)
}


function renderWin(board) {
    gGame.isOn = false
    resetTimer()
    var elTimer = document.querySelector('.timer span')
    elTimer.innerText = gPausedTime
    var elEmoji = document.querySelector('button.reset')
    elEmoji.innerText = WIN
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            
            if (board[i][j].isCovered === true) {
                console.log(board[i][j].isCovered)
                board[i][j].isCovered = false
                document.querySelector(`.cell-${i}-${j}`).classList.remove('covered')
            }

        }
    }

}


// When the user clicks a cell with no mines around, uncover not only that cell, but also its neighbors.
// NOTE: start with a basic implementation that only uncovers the non-mine 1st degree neighbors

///NEED TO FIX coveredCount

function expandUncoveredBoard(mat, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].minesAroundCount === 0) {
                if (mat[i][j].isCovered === true) {
                    gGame.coveredCount--
                }
                mat[i][j].isCovered = false
                document.querySelector(`.cell-${i}-${j}`).classList.remove('covered')
                // console.log(gGame.coveredCount)
                if (mat[i][j].isCovered === true) {
                    gGame.coveredCount--
                } else return
                console.log(mat[i][j])
            }
        }
    }
}


// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}


function isMine(board, i, j) {
    return board[i][j].isMine
}

function updateLives(lives) {
    gPlayer.lives = lives
    var elLives = document.querySelector('.lives span')
    elLives.innerText = gPlayer.lives
    if (checkGameOver()) {
        elLives.innerHTML = '<span>' + gPlayer.lives + '</span>'
    }
}




//TODO
//SUPPORT RIGHT CLICK MARK AND UNMARK