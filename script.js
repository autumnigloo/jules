// Global Variables
let board = Array(8).fill(null).map(() => Array(8).fill(0));
let currentPlayer = 'black';
let isGameOver = false; // Added isGameOver flag
const blackScoreDisplay = document.getElementById('black-score');
const whiteScoreDisplay = document.getElementById('white-score');
const messageArea = document.getElementById('message-area');
const gameBoardHTML = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');

// initializeBoard() function
function initializeBoard() {
    isGameOver = false; // Reset game over flag
    currentPlayer = 'black'; // Set current player to black

    // Set all cells to 0 (empty)
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            board[i][j] = 0;
        }
    }

    // Place initial four Othello pieces
    board[3][3] = 2; // white
    board[3][4] = 1; // black
    board[4][3] = 1; // black
    board[4][4] = 2; // white

    updateScores(); // Update scores
    renderBoard(); // Render the board
    messageArea.textContent = "Black's turn."; // Set initial message
}

// renderBoard() function
function renderBoard() {
    gameBoardHTML.innerHTML = ''; // Clear gameBoardHTML

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[row][col] === 1) {
                cell.classList.add('black-piece');
            } else if (board[row][col] === 2) {
                cell.classList.add('white-piece');
            }
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => handleCellClick(row, col)); // Added event listener
            gameBoardHTML.appendChild(cell);
        }
    }
}

// updateScores() function (helper for initializeBoard and later use)
function updateScores() {
    let blackScore = 0;
    let whiteScore = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 1) {
                blackScore++;
            } else if (board[i][j] === 2) {
                whiteScore++;
            }
        }
    }
    blackScoreDisplay.textContent = blackScore;
    whiteScoreDisplay.textContent = whiteScore;
}

// handleCellClick function
function handleCellClick(row, col) {
    if (isGameOver) return; // Check if game is over

    if (board[row][col] !== 0) {
        messageArea.textContent = "Cell occupied. Try another move.";
        return;
    }

    const piecesToFlip = getPiecesToFlip(row, col, currentPlayer);

    if (piecesToFlip.length === 0) {
        messageArea.textContent = "Invalid move. Try again.";
        return;
    }

    // Place piece and flip opponent pieces
    board[row][col] = (currentPlayer === 'black' ? 1 : 2);
    flipPieces(piecesToFlip);
    updateScores(); // Update scores immediately

    if (checkGameEnd()) {
        // Game has ended, checkGameEnd handles messages and isGameOver
    }
    // If game didn't end, currentPlayer might have switched, message is updated by checkGameEnd.

    renderBoard(); // Render the board after all logic
}

// canPlayerMakeMove(player) function
function canPlayerMakeMove(player) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === 0) { // If cell is empty
                if (getPiecesToFlip(r, c, player).length > 0) {
                    return true; // Found a valid move
                }
            }
        }
    }
    return false; // No valid moves found
}

// getPiecesToFlip(row, col, player) function
function getPiecesToFlip(row, col, player) {
    const playerPiece = (player === 'black' ? 1 : 2);
    const opponentPiece = (player === 'black' ? 2 : 1);
    let piecesToFlip = [];

    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0], // Horizontal and Vertical
        [1, 1], [1, -1], [-1, 1], [-1, -1] // Diagonals
    ];

    for (const [dr, dc] of directions) {
        let potentialFlipsInDirection = [];
        let currentRow = row + dr;
        let currentCol = col + dc;

        while (currentRow >= 0 && currentRow < 8 && currentCol >= 0 && currentCol < 8) {
            if (board[currentRow][currentCol] === opponentPiece) {
                potentialFlipsInDirection.push({ r: currentRow, c: currentCol });
            } else if (board[currentRow][currentCol] === playerPiece) {
                // Found a bracketing piece
                piecesToFlip = piecesToFlip.concat(potentialFlipsInDirection);
                break; // Move to the next direction
            } else {
                // Empty cell or same player piece immediately next, so no flips in this direction
                break;
            }
            currentRow += dr;
            currentCol += dc;
        }
    }
    return piecesToFlip;
}

// flipPieces(piecesToFlipArray) function
function flipPieces(piecesToFlipArray) {
    const pieceToPlace = (currentPlayer === 'black' ? 1 : 2);
    for (const piece of piecesToFlipArray) {
        board[piece.r][piece.c] = pieceToPlace;
    }
}

// determineWinner() function
function determineWinner() {
    updateScores(); // Ensure scores are current
    const blackScore = parseInt(blackScoreDisplay.textContent);
    const whiteScore = parseInt(whiteScoreDisplay.textContent);

    if (blackScore > whiteScore) {
        messageArea.textContent = "Black wins!";
    } else if (whiteScore > blackScore) {
        messageArea.textContent = "White wins!";
    } else {
        messageArea.textContent = "It's a tie!";
    }
    isGameOver = true;
}

// checkGameEnd() function
function checkGameEnd() {
    // Board Full Check
    let emptyCells = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === 0) {
                emptyCells++;
            }
        }
    }
    if (emptyCells === 0) {
        determineWinner();
        return true; // Game is over
    }

    const currentPlayerCanMove = canPlayerMakeMove(currentPlayer);
    const opponent = (currentPlayer === 'black' ? 'white' : 'black');

    if (currentPlayerCanMove) {
        messageArea.textContent = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1) + "'s turn.";
        return false; // Game not over
    } else {
        // Current player cannot move
        const opponentCanMove = canPlayerMakeMove(opponent);
        if (opponentCanMove) {
            const originalPlayer = currentPlayer;
            currentPlayer = opponent; // Switch turns
            messageArea.textContent = originalPlayer.charAt(0).toUpperCase() + originalPlayer.slice(1) + " has no moves. " + currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1) + "'s turn.";
            return false; // Game not over, turn passed to opponent
        } else {
            // Neither player can move
            determineWinner();
            return true; // Game is over
        }
    }
}

// Reset game event listener
resetButton.addEventListener('click', initializeBoard);

// Initial Call
initializeBoard();
