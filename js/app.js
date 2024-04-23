/*-------------------------------- Constants --------------------------------*/
// This section initializes a couple variables and then checks previous game stats locally and retrieves them if available
const localStorage = window.localStorage;
let statsString, gameData

if (!localStorage.getItem('stats')) {
    zeroGameData()
    statsString = JSON.stringify(gameData)
} else {
    statsString = localStorage.getItem('stats')
    gameData = JSON.parse(statsString)
}

const jumpCombos = [
    //facing down
    [0,18,9],
    [2,20,11],[2,16,9],
    [4,18,11],[4,22,13],
    [6,20,13],

    [9,27,18],
    [11,25,18],[11,29,20],
    [13,27,20],[13,31,22],
    [15,29,30],

    [16,34,25],
    [18,32,25],[18,36,27],
    [20,34,27],[20,38,29],
    [30,44,37],

    [25,43,34],
    [27,41,34],[27,45,36],
    [29,43,26],[29,17,38],
    [31,45,38],

    [32,58,49],
    [34,48,41],[34,52,43],
    [36,50,43],[36,54,45],
    [38,52,45],

    [41,59,50],
    [43,57,50],[43,61,52],
    [45,59,52],[45,63,54],
    [47,61,54],

    // facing up
    [52,43,50],
    [59,41,50],[59,45,52],
    [61,43,52],[61,47,54],
    [63,45,54],

    [48,34,41],
    [50,32,41],[50,36,43],
    [52,34,43],[52,38,45],
    [43,36,45],

    [41,27,34],
    [43,25,34],[43,29,36],
    [45,27,36],[45,31,38],
    [47,29,38],

    [32,18,25],
    [34,16,25],[34,20,27],
    [36,18,27],[36,22,29],
    [38,20,29],

    [25,11,18],
    [27,9,18],[27,13,20],
    [29,11,20],[29,15,22],
    [31,13,22],

    [16,2,9],
    [18,0,9],[18,4,11],
    [20,2,11],[20,6,13],
    [22.4,13],
]

/*---------------------------- Variables (state) ----------------------------*/
let board, turn, winner, tie, firstClickedSquare, playerPiece
// Limited the alt text below to assist in rendering when images fail to load.
let xToken = "<img src='assets/xtoken.png' class = 'btoken' width='85%' alt='X'>"
let oToken = "<img src='assets/otoken.png' class = 'wtoken' width='85%' alt='0'>"
let isFirstClick = true

/*------------------------ Cached Element References ------------------------*/

const boardEl = document.querySelector('.board')
const messageEl = document.querySelector('#message')
const resetBtnEl = document.querySelector('#reset')
const squareEls = document.querySelectorAll('.sqr')
const playBtnEl = document.querySelector('#close-modal')
const playAgainBtnEl = document.querySelector('#play-again')
const openModalEl = document.querySelector('#open-modal')
const endModalEl = document.querySelector('#end-modal')
const statsEl = document.querySelector('#stats')
const resetStatsBtnEl = document.querySelector('#reset-stats')


/*-------------------------------- Functions --------------------------------*/

function init() {
    board = [
    'w','','w','','w','','w','',
    '','w','','w','','w','','w',
    'w','','w','','w','','w','',
    '','','','','','','','',
    '','','','','','','','',
    '','b','','b','','b','','b',
    'b','','b','','b','','b','',
    '','b','','b','','b','','b',
    ]
    turn = "b"
    winner = false
    tie = false
    render()
}

function updateBoard() {
    board.forEach((sqr,idx) => {
        if (sqr === "b") {
            squareEls[idx].innerHTML = "b"
        } else if (sqr === "w") {
            squareEls[idx].innerHTML = "w"
        } else {
            squareEls[idx].innerText = sqr
        }
    })
}

function updateMessage() {
    if (winner === false && tie === false) {
        messageEl.innerText = (`It's Player ${turn}'s turn.`)
    } else if (winner === false && tie === true) {
        messageEl.innerText = ("It's a tie!")
    } else {
        messageEl.innerText = (`${turn} is the winner!`)
    }
}

function render() {
    updateBoard()
    updateMessage()
}

function handleClick(event) {
    if (isFirstClick) {
        firstClickOnSquare(event.target)
    } else {
        secondClickOnSquare(event.target)
    }
    if (winner === true) return
    checkForWinner()
    checkForTie()
    render()
}

function placePiece(squareClicked) {
    board[squareClicked.id] = turn
}

function firstClickOnSquare (squareClicked) {
    if (board[squareClicked.id].toLowerCase() == turn) {
        console.log("first square clicked")
        squareClicked.classList.add = "clicked"
        playerPiece = board[squareClicked.id]
        isFirstClick = false
        firstClickedSquare = squareClicked.id
    }
}

function secondClickOnSquare(squareClicked) {
    console.log("second square clicked")
    // if (!checkValidMove) return
    squareClicked.classList.remove = "clicked"
    board[firstClickedSquare] = ''
    pieceJump(firstClickedSquare, squareClicked.id)
    kingMe(squareClicked)
    board[squareClicked.id] = playerPiece
    isFirstClick = true
    switchPlayerTurn()
}

function pieceJump(first, second) {
    jumpCombos.forEach((combo) => {
        if ((combo[0] == first) && (combo[1] == second)) {
            board[combo[2]] = ''
        }
    })
}

function kingMe(squareClicked) {
    if ((turn === 'b') && ((squareClicked.id == 0) ||
    (squareClicked.id == 2) ||
    (squareClicked.id == 4) ||
    (squareClicked.id == 6) )) {
        playerPiece = "B"
    }

    if ((turn === 'w') && ((squareClicked.id == 57) ||
    (squareClicked.id == 59) ||
    (squareClicked.id == 61) ||
    (squareClicked.id == 63) )) {
        console.log(turn+squareClicked.id)
        playerPiece = "W"
    }
    
}
    
function checkValidMove() {
}

function checkForWinner() {
    if (!board.includes('b' || "B")) winner = "w"
    if (!board.includes('w' || "W")) winner = "b"
}

function checkForTie() {
    if (winner === true) return
    if (!(board.some(sqr => (sqr === '')))) {
        tie = true
        gameData.ties++
    }
}

function switchPlayerTurn() {
    if (winner === true) return
    (turn === "b") ? (turn = "w") : turn = "b"
}

function playGame() {
    displayGameBoard()
    openModalEl.style.display = "none"
    endModalEl.style.display = "none"
    init()
}

function resetModal() {
    openModalEl.style.display = "flex"
    hideGameBoard()
}

function zeroGameData() {
    gameData = {
        xWins: 0,
        oWins: 0,
        ties: 0,
        }
}

function displayEndModal() {
    hideGameBoard()
    endModalEl.style.display = "flex";
    statsEl.innerText = `${turn} is the winner!
    Player X has won ${gameData.xWins} times.
    Player O has won ${gameData.oWins} times.
    There have been ${gameData.ties} ties.`
    statsString = JSON.stringify(gameData)
    localStorage.setItem('stats', statsString)
}

function resetStats() {
    zeroGameData()
    displayEndModal()
    localStorage.clear()
}

function displayGameBoard() {
    boardEl.style.display = "flex"
}

function hideGameBoard() {
    boardEl.style.display = "none"
}

/*----------------------------- Event Listeners -----------------------------*/

boardEl.addEventListener('click', handleClick)
resetBtnEl.addEventListener('click', resetModal)
playBtnEl.addEventListener('click', playGame)
playAgainBtnEl.addEventListener('click', playGame)
resetStatsBtnEl.addEventListener('click', resetStats)


init();