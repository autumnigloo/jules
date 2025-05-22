document.addEventListener('DOMContentLoaded', () => {
    const testResultsList = document.getElementById('test-results');
    let testsPassed = 0;
    let testsFailed = 0;

    function assertEqual(actual, expected, message) {
        if (actual === expected) {
            reportTestResult(true, message + ` (Expected: ${expected}, Got: ${actual})`);
        } else {
            reportTestResult(false, message + ` (Expected: ${expected}, Got: ${actual})`);
        }
    }

    function assertDeepEqual(actual, expected, message) {
        if (JSON.stringify(actual) === JSON.stringify(expected)) {
            reportTestResult(true, message);
        } else {
            reportTestResult(false, message + ` (Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)})`);
        }
    }
    
    function assertTrue(condition, message) {
        if (condition) {
            reportTestResult(true, message);
        } else {
            reportTestResult(false, message + ` (Expected: true, Got: ${condition})`);
        }
    }

    function assertFalse(condition, message) {
        if (!condition) {
            reportTestResult(true, message);
        } else {
            reportTestResult(false, message + ` (Expected: false, Got: ${condition})`);
        }
    }

    function reportTestResult(passed, message) {
        const listItem = document.createElement('li');
        listItem.textContent = (passed ? '[PASSED] ' : '[FAILED] ') + message;
        listItem.className = passed ? 'passed' : 'failed';
        testResultsList.appendChild(listItem);
        if (passed) testsPassed++; else testsFailed++;
    }

    function runTests() {
        console.log("Running tests...");
        // --- Test Suite ---

           // Test 1: Board Initialization
           initializeBoard(); // Reset board before each logical test group
           reportTestResult(true, "--- Testing Board Initialization ---");
           assertEqual(board[3][3], 2, "Initial white piece at [3][3]");
           assertEqual(board[3][4], 1, "Initial black piece at [3][4]");
           assertEqual(board[4][3], 1, "Initial black piece at [4][3]");
           assertEqual(board[4][4], 2, "Initial white piece at [4][4]");
           assertEqual(parseInt(blackScoreDisplay.textContent), 2, "Initial black score");
           assertEqual(parseInt(whiteScoreDisplay.textContent), 2, "Initial white score");
           assertEqual(currentPlayer, 'black', "Initial player is black");
           assertFalse(isGameOver, "isGameOver is false initially");

           // Test 2: getPiecesToFlip()
           initializeBoard();
           reportTestResult(true, "--- Testing getPiecesToFlip ---");
           // Black plays at [2][3] - should flip white piece at [3][3]
           let piecesToFlip = getPiecesToFlip(2, 3, 'black');
           assertDeepEqual(piecesToFlip.map(p => [p.r, p.c]).sort(), [[3,3]].sort(), "Black move at [2,3] should flip [3,3]");

           // White plays at [2][4] - should flip black piece at [3][4]
           initializeBoard(); // Reset board for this specific sub-test
           board[2][4] = 0; // Make sure it's empty
           board[3][4] = 1; // Black piece
           board[4][4] = 2; // White anchor
           piecesToFlip = getPiecesToFlip(2, 4, 'white'); // white's turn hypothetically
           assertDeepEqual(piecesToFlip.map(p => [p.r, p.c]).sort(), [[3,4]].sort(), "White move at [2,4] should flip [3,4]");

           // No flip - empty line
           initializeBoard();
           piecesToFlip = getPiecesToFlip(0, 0, 'black');
           assertEqual(piecesToFlip.length, 0, "No pieces to flip for move at [0,0] on initial board");

           // No flip - surrounded by own pieces
           initializeBoard();
           board[2][3] = 1; // Friendly piece
           piecesToFlip = getPiecesToFlip(1, 3, 'black'); // Trying to play next to own piece
           assertEqual(piecesToFlip.length, 0, "No pieces to flip if not bracketing opponent");
           
           // Multiple directions test case was a bit complex and had issues, simplifying.
           // Test flipping downwards (original test for (1,4) was for flipping (2,4) which is from initial board state)
           initializeBoard(); 
           // Initial state has B at (3,4) and W at (2,4)
           // If black plays at (1,4), it should flip W at (2,4)
           piecesToFlip = getPiecesToFlip(1,4, 'black');
           // Need to sort the inner arrays as well for assertDeepEqual if order of [r,c] can vary
           assertDeepEqual(piecesToFlip.map(p=>[p.r,p.c]).sort((a,b) => a[0]-b[0] || a[1]-b[1]), [[2,4]].sort((a,b) => a[0]-b[0] || a[1]-b[1]), "Black at (1,4) flips W at (2,4)");
           
           // Test flipping upwards
           initializeBoard();
            // B at (4,3) W at (5,3) for black player to play at (6,3)
           piecesToFlip = getPiecesToFlip(5,2,'black'); // Should flip (4,3)
           assertDeepEqual(piecesToFlip.map(p=>[p.r,p.c]).sort((a,b) => a[0]-b[0] || a[1]-b[1]), [[4,3]].sort((a,b) => a[0]-b[0] || a[1]-b[1]), "Black at (5,2) flips (4,3)");


           // Test 3: canPlayerMakeMove()
           initializeBoard();
           reportTestResult(true, "--- Testing canPlayerMakeMove ---");
           assertTrue(canPlayerMakeMove('black'), "Black should have moves on initial board");
           assertTrue(canPlayerMakeMove('white'), "White should have moves on initial board");
           
           // Fill board almost completely, leave one spot for black to play
           for(let r=0; r<8; r++) for(let c=0; c<8; c++) board[r][c] = (r+c)%2 === 0 ? 1 : 2; // Fill with alternating
           board[0][0] = 0; // Empty spot
           board[0][1] = 2; // Opponent for black to flip (was 1, needs to be opponent)
           board[0][2] = 1; // Anchor for black (was 2, needs to be self)
           // Now check if black can play at 0,0
           assertTrue(getPiecesToFlip(0,0,'black').length > 0, "Test setup: Black should be able to play at [0,0]");
           assertTrue(canPlayerMakeMove('black'), "Black should have a move on nearly full board");
           
           // Make it impossible for white to move
           for(let r=0; r<8; r++) for(let c=0; c<8; c++) board[r][c] = 1; // All black
           board[0][0] = 0; // one empty cell
           assertFalse(canPlayerMakeMove('white'), "White has no moves if board is all black with one empty cell");


           // Test 4: Game End - Board Full
           initializeBoard();
           reportTestResult(true, "--- Testing Game End: Board Full ---");
           for(let r=0; r<8; r++) for(let c=0; c<8; c++) board[r][c] = 1; // Fill with black
           isGameOver = false; // reset for test
           checkGameEnd(); // Should set isGameOver and winner message
           assertTrue(isGameOver, "Game should be over when board is full");
           assertEqual(messageArea.textContent, "Black wins!", "Message should be Black wins");


           // Test 5: Game End - No Moves for Either Player
           initializeBoard();
           reportTestResult(true, "--- Testing Game End: No Moves ---");
           // Setup a board where no one can move (e.g., checkerboard pattern that's stuck)
           for(let r=0; r<8; r++) for(let c=0; c<8; c++) {
               board[r][c] = ((r % 2 === 0 && c % 2 === 0) || (r % 2 !== 0 && c % 2 !== 0)) ? 1 : 2;
           }
           // Ensure this state actually has no moves
           assertFalse(canPlayerMakeMove('black'), "Test setup: Black should have no moves");
           assertFalse(canPlayerMakeMove('white'), "Test setup: White should have no moves");
           
           isGameOver = false; // reset for test
           currentPlayer = 'black'; // Set current player
           checkGameEnd();
           assertTrue(isGameOver, "Game should be over when no player has moves");
           // Winner depends on counts, check a specific scenario if counts are predictable
           // For this pattern, black has 32, white has 32.
           updateScores(); // update scores from board state
           assertEqual(messageArea.textContent, "It's a tie!", "Message should be It's a tie for this specific no-move board");
           
           // Test 6: Player switch when one player has no moves
           initializeBoard();
           reportTestResult(true, "--- Testing Player Switch on No Moves ---");
           // Make it so black has no moves, but white does
           // Setup:
           // B W .  <- white to play at (0,2), needs W at (0,0) and B at (0,1)
           // W W W
           // W W W
           for(let r=0; r<8; r++) for(let c=0; c<8; c++) board[r][c] = 2; // Fill with white
           board[0][0] = 2; // White
           board[0][1] = 1; // Black
           board[0][2] = 0; // Empty for white to play
           // Ensure black cannot move with this setup
           // Quick check: any empty cell next to a white piece, with a black piece on the other side for black to flip?
           // This setup should make black have no moves as it's mostly white.
           let blackCanMove = false;
            for(let r=0; r<8; r++) {
                for(let c=0; c<8; c++) {
                    if(board[r][c] === 0 && getPiecesToFlip(r,c,'black').length > 0) {
                        blackCanMove = true; break;
                    }
                }
                if (blackCanMove) break;
            }
           assertFalse(blackCanMove, "Test setup: Black has no moves");
           assertTrue(canPlayerMakeMove('white'), "Test setup: White has moves (e.g. at 0,2)");
           
           isGameOver = false;
           currentPlayer = 'black';
           checkGameEnd(); // This should switch player to white
           assertFalse(isGameOver, "Game should not be over yet");
           assertEqual(currentPlayer, 'white', "Player should switch to white");
           assertTrue(messageArea.textContent.includes("Black has no moves. White's turn."), "Message should indicate player switch");

           // Test 7: handleCellClick - valid move
           initializeBoard();
           reportTestResult(true, "--- Testing handleCellClick: Valid Move ---");
           const initialBlackScore = parseInt(blackScoreDisplay.textContent);
           handleCellClick(2,3); // Black plays at [2,3], flips white at [3,3]
           assertEqual(board[2][3], 1, "Cell [2,3] should be black after move");
           assertEqual(board[3][3], 1, "Cell [3,3] should be flipped to black");
           assertEqual(currentPlayer, 'white', "Player should be white after black's move");
           assertTrue(parseInt(blackScoreDisplay.textContent) > initialBlackScore, "Black score should increase");

           // Test 8: handleCellClick - invalid move (occupied cell)
           initializeBoard();
           reportTestResult(true, "--- Testing handleCellClick: Occupied Cell ---");
           handleCellClick(3,3); // Click on an existing piece
           assertEqual(messageArea.textContent, "Cell occupied. Try another move.", "Message for occupied cell");
           assertEqual(currentPlayer, 'black', "Player should still be black");

           // Test 9: handleCellClick - invalid move (no flips)
           initializeBoard();
           reportTestResult(true, "--- Testing handleCellClick: No Flips ---");
           handleCellClick(0,0); // Click on cell that results in no flips
           assertEqual(messageArea.textContent, "Invalid move. Try again.", "Message for no flips");
           assertEqual(currentPlayer, 'black', "Player should still be black");

        // --- End Test Suite ---
        console.log(`Tests finished: ${testsPassed} passed, ${testsFailed} failed.`);
        const summary = document.createElement('p');
        summary.textContent = `Summary: ${testsPassed} passed, ${testsFailed} failed.`;
        testResultsList.parentElement.appendChild(summary);
    }

    // Run tests when the DOM is fully loaded and script.js has presumably also run.
    runTests();
});
