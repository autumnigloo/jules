# Othello Game

A simple web-based Othello (Reversi) game implemented with HTML, CSS, and JavaScript.

## Files

*   `index.html`: The main HTML file for the game.
*   `style.css`: CSS styles for the game.
*   `script.js`: JavaScript logic for the game.
*   `test.html`: HTML page for running unit tests.
*   `test_runner.js`: JavaScript file containing the unit tests.

## How to Play

1.  Open `index.html` in a web browser.
2.  Black pieces go first. Click on an empty square to make a move.
3.  A move is valid if it flanks one or more of the opponent's pieces.
4.  The game ends when the board is full or neither player has a valid move.
5.  The player with the most pieces on the board wins.

## Running Unit Tests

1.  Open `test.html` in a web browser.
2.  The results of the unit tests will be displayed on the page.

## Deploying to GitHub Pages

To deploy this game to GitHub Pages:

1.  **Create a GitHub Repository:**
    *   If you haven't already, create a new public repository on GitHub.

2.  **Commit and Push Files:**
    *   Add all the game files (`index.html`, `style.css`, `script.js`, `test.html`, `test_runner.js`, and this `README.md`) to your local Git repository.
    *   Commit the files:
        ```bash
        git add .
        git commit -m "Initial commit of Othello game"
        ```
    *   Add the GitHub repository as a remote:
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
        ```
    *   Push the files to GitHub:
        ```bash
        git push -u origin main 
        ```
        (Or `master` if that's your default branch name)

3.  **Enable GitHub Pages:**
    *   In your GitHub repository, go to "Settings".
    *   Scroll down to the "GitHub Pages" section (it might be under "Pages" in the left sidebar).
    *   Under "Source", select your main branch (e.g., `main` or `master`) and the `/ (root)` folder.
    *   Click "Save".

4.  **Access Your Game:**
    *   GitHub Pages will build your site and provide a URL, usually in the format `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`.
    *   It might take a few minutes for the site to become available.
