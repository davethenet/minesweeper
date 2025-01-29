'use strict'



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

// function getBlankNebs(cellI, cellJ, mat){
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= mat.length) continue
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (i === cellI && j === cellJ) continue
//             if (j < 0 || j >= mat[i].length) continue
//             if (mat[i][j].minesAroundCount === 0) {
//               mat[i][j].isCovered = false
//               document.querySelector(`.cell-${i}-${j}`).classList.remove('covered')

//             }
//         }
//     }
// }



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
      if (!board[i][j].isMine && !board[i][j].isMarked) {
        emptyCells.push({ i, j })
      }
    }
  }

  return emptyCells
}






function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = `<span> ${value} </span>`
}




// Returns the class name for a specific cell
function getClassName(location) {
  const cellClass = 'cell-' + location.i + '-' + location.j
  return cellClass
}
