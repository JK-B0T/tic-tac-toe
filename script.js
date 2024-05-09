document.addEventListener("DOMContentLoaded", main, false);

function main() {

    function createCell (symbol = "") {

        const setSymbol = (newsymbol) => {
            symbol = newsymbol;
        }

        const getSymbol = () => {
            return symbol;
        }

        return {setSymbol, getSymbol};
    }

    function createPlayer (name = "anon", symbol = "-") {
        let score = 0;

        const getSymbol = () => {
            return symbol;
        }

        const getName = () => {
            return name;
        }

        const getScore = () => {
            return score;
        }

        const increaseScore = () => {
            score++;
        }

        return {getName, getSymbol, increaseScore, getScore};
    }

    const boardGrid = (function (rows, columns) {
        let grid = [];

        for (let i = 0; i < columns; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                grid[i][j] = createCell("");
            }
        }

        const checkPosition = (x, y) => {
            if ((x < columns && x >= 0) && (y < rows && y >= 0)) {
                if (grid[x][y].getSymbol() === "") {
                    return true;
                } else {return false;}
            } else {return false;}
        }

        const checkVictory = (x, y, symbol) => {
            let isWin = true;
            for (let iy = 0; iy < rows; iy++) {
                if (!(grid[x][iy].getSymbol() === symbol)) {
                    isWin = false;
                    break;
                }
            }
            if (isWin === true) {
                return true;
            } else {
                isWin = true;
            }

            for (let ix = 0; ix < columns; ix++) {
                if (!(grid[ix][y].getSymbol() === symbol)) {
                    isWin = false;
                    break;
                }
            }
            if (isWin === true) {
                return true;
            } else {
                isWin = true;
            }

            let iy = 0;
            for (let ix = 0; ix < columns; ix++) {
                if (!(grid[ix][iy].getSymbol() === symbol)) {
                    isWin = false;
                    break;
                }
                iy++;
            }
            if (isWin === true) {
                return true;
            } else {
                isWin = true;
            }

            iy = rows-1;
            for (let ix = 0; ix < columns; ix++) {
                if (!(grid[ix][iy].getSymbol() === symbol)) {
                    isWin = false;
                    break;
                }
                iy--;
            }
            if (isWin === true) {
                return true;
            } else {
                isWin = true;
            }

            return false;
        }

        const changeCellSymbol = (x, y, newSymbol) => {
                grid[x][y].setSymbol(newSymbol);
        }

        const showGrid = () => {
            let gridVisual = ""
            for (let i = 0; i < columns; i++) {
                for (let j = 0; j < rows; j++) {
                    gridVisual += `[${grid[i][j].getSymbol()}] `;
                }
                gridVisual += `\n`;
            }
            console.log(gridVisual);
        }

        return {showGrid, checkPosition, changeCellSymbol, checkVictory};
    })(3, 3);

    const gameController = (function (board) {
        let players = [];
        let turn = 0;

        const setPlayers = (newPlayers) => {
            players = newPlayers;
        }
        const setBoard = (newBoard) => {
            board = newBoard;
        }

        const getTurn = () => {
            return turn;
        }

        const setTurn = (newTurn) => {
            turn = newTurn;
        }

        const setMove = (x, y) => {
            if (board.checkPosition(x, y)) {
                board.changeCellSymbol(x, y, players[turn].getSymbol());
                return true;
            } else {
                return false;
            }
        }

        return {setMove, setPlayers, setTurn, getTurn, setBoard};
    })(boardGrid);

    const gameManager = (function (board, controller, pointsToWin) {
        const player1 = createPlayer("Popo", "x");
        const player2 = createPlayer("Johnson", "o");
        const players = [player1, player2];

        const startGame = () => {
            controller.setPlayers(players);
            controller.setBoard(board);
            if ((players[0].getScore() < pointsToWin) && (players[1].getScore() < pointsToWin)) {
                resolveGame();
            }
        }

        const resolveGame = () => {
            for (let turnsRemaining = 9; turnsRemaining > 0;) {
                let x = +prompt("Row");
                let y = +prompt("Column");
                if(controller.setMove(x, y)) {
                    turnsRemaining--;
                    board.showGrid();
                    if (board.checkVictory(x, y, players[controller.getTurn()].getSymbol())) {
                        console.log(players[controller.getTurn()].getName() + " WINS!");
                        break;
                    }
                    changeTurn();
                }
            }
        }

        const changeTurn = () => {
            if (controller.getTurn() === 0) {
                controller.setTurn(1);
            } else {
                controller.setTurn(0);
            }
        }

        return {startGame};
    })(boardGrid, gameController, 3);

    gameManager.startGame();
    console.log("main ends");
}