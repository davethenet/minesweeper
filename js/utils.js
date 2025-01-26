'use strict'

document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});


// Getting a random integer between two values

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

//   Getting a random integer between two values, inclusive

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
  }

  

  function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isMine === true) neighborsCount++
        }
    }
    return neighborsCount
}


function createMat(ROWS, COLS) {
  const mat = []
  for (var i = 0; i < ROWS; i++) {
      const row = []
      for (var j = 0; j < COLS; j++) {
          row.push('')
      }
      mat.push(row)
  }
  return mat
}


function getEmptyCells(board) {
  var emptyCells = []

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].isMine === false) {
        emptyCells.push({ i, j })
      }
    }
  }

  return emptyCells
}



function startTimer() {
  gStartTime = Date.now()
  gInterval = setInterval(updateTime, 1)
}


function updateTime() {
  var currTime = Date.now()
  var elapsedTime = currTime - gStartTime


  var min = Math.floor(elapsedTime / (1000 * 60) % 60)
  var sec = Math.floor(elapsedTime / 1000 % 60)
  var milSec = Math.floor(elapsedTime % 1000)


  var elTime = document.querySelector('.timer span')
  elTime.innerHTML = `${sec}`
}

function resetTimer() {
  clearInterval(gInterval)
  var elTimer = document.querySelector('.timer span')
  elTimer.innerHTML = '000'
  gStartTime = 0
  gInterval = null
}
