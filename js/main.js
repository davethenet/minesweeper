'use strict'

const EMPTY = ' '
const MINE = '💣'

var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2,
}

var gGame = {
    isOn: false,
    coveredCount: 0,
    MarkedCount: 0,
    secsPassed: 0,
}


var gCell = {

}


//Called when page loads
function onInit() {
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)

    renderBoard(gBoard)
   
}


// Builds the board 
// Set some mines Call
// setMinesNegsCount() 
// Return the created board

function buildBoard() {
    const SIZE = 4
    var board = createMat(SIZE, SIZE)
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

    //STATIC MINES:
    placeMines(board)


    //RANDOM MINES:

    // board[getRandomInt(0, 4)][getRandomInt(0, 4)] = {
    //     minesAroundCount: null,
    //     isCovered: true,
    //     isMine: true,
    //     isMarked: false,
    // }

    // var emptyCells = getEmptyCells(board) 
    // var randomCell = emptyCells[getRandomInt(0, SIZE)]

    // board[randomCell.i][randomCell.j] = {
    //     minesAroundCount: null,
    //     isCovered: true,
    //     isMine: true,
    //     isMarked: false,
    // }
    return board
}


function placeMines(board){
    board[2][1] = {
        minesAroundCount: null,
        isCovered: true,
        isMine: true,
        isMarked: false,
    }


    board[2][2] = {
        minesAroundCount: null,
        isCovered: true,
        isMine: true,
        isMarked: false,
    }
}

// Count mines around each cell
// and set the cell's
// minesAroundCount

function setMinesNegsCount(board) {
    for (var i = 0 ; i < board.length ; i++){
        for (var j = 0 ; j < board[0].length ; j++){
            board[i][j].minesAroundCount = countNeighbors(i,j,board)
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
            strHTML += '\t<td class="cell ' + cellClass + '"  onclick="onCellClicked(' + 'this' + ',' + i + ',' + j + ')" >\n'



			if (currCell.isMine === false) {
				strHTML += '<span>' + currCell.minesAroundCount + '</span>'
			} else if (currCell.isMine === true) {
				strHTML += '<span>' + MINE + '</span>'
			} else if (currCell.minesAroundCount) {
				strHTML += '<span>' + currCell.minesAroundCount + '</span>'
			}

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

function onCellClicked(elCell, i, j) {
    console.log(elCell)
    document.querySelector(`.cell-${i}-${j}`).classList.remove('covered')


}

// Called when a cell is right-clicked See how you can hide the context menu on right click
function onCellMarked(elCell) {

}

// The game ends when all mines are marked, and all the other cells are uncovered
function checkGameOver() {

}


// When the user clicks a cell with no mines around, uncover not only that cell, but also its neighbors.
// NOTE: start with a basic implementation that only uncovers the non-mine 1st degree neighbors

function expandUncoveredBoard(board, elCell, i, j) {

}


// Returns the class name for a specific cell
function getClassName(location) {
	const cellClass = 'cell-' + location.i + '-' + location.j
	return cellClass
}