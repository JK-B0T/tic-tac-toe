document.addEventListener("DOMContentLoaded", main, false);

function main() {

    const board = ((rows, columns) => {
        let grid = [];

        const resizeGrid = (rows, columns) => {
            this.rows = rows;
            this.columns = columns;
        }

        const createGrid = () => {
            for (let x = 0; x < rows; x++) {
                grid[x] = [];
                for (let y = 0; y < columns; y++) {
                    grid[x][y] = {};
                }
            }
        }

        const getGrid = () => {
            return grid;
        }

        const createGridProperty = (property) => {
            for (let x = 0; x < rows; x++) {
                for (let y = 0; y < columns; y++) {
                    grid[x][y][property] = null;
                }
            }
        }

        const getCell = (x, y) => {
            return grid[x][y];
        }

        const getCellProperty = (x, y, property) => {
            return grid[x][y].property;
        }

        const fillCellProperty = (pos, property, value) => {
            grid[pos[0]][pos[1]][property] = value;
        }

        createGrid(rows, columns);
        createGridProperty("entity");
        return {getGrid, createGridProperty, getCellProperty, fillCellProperty};
    })(3, 3);

    const consoleRender = (() => {

        const showGrid = (grid, property) => {
            let visualGrid = "";
            for (let x = 0; x < rows; x++) {
                x !== 0 ? visualGrid += "\n" : false;
                for (let y = 0; y < columns; y++) {
                    visualGrid += grid.getCell(x, y, property);
                }
            }
            console.log(visualBoard);
        }

        return {showGrid};
    })();

    consoleRender.showGrid(board.getGrid(), "entity");
    /* 
    function createCell (symbol = "", id) {


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
                grid[i][j] = createCell("", `${i}${j}`);
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

        const reset = () => {
            for (let i = 0; i < columns; i++) {
                for (let j = 0; j < rows; j++) {
                    grid[i][j].setSymbol("");
                }
            }
        }

        return {showGrid, checkPosition, changeCellSymbol, checkVictory, reset};
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

    const gameManager = (function (board, controller, gamesNum) {
        let players = [];
        let turnNum = 1;

        const definePlayers = () => {
            const player1 = createPlayer(
                prompt("Player 1 name"), 
                prompt("Player 1 symbol")
            );
            const player2 = createPlayer(
                prompt("Player 2 name"), 
                prompt("Player 2 symbol")
            );
            return players = [player1, player2];
        }

        const startGame = () => {
            controller.setPlayers(definePlayers());
            controller.setBoard(board);
            
            const domCells = Array.from(document.querySelectorAll("section button"));
            domCells.map((cell) => {cell.addEventListener("click", test, false)})

            /*
            while (gamesNum >= 0) {
                resolveGame();
                gamesNum--;
            } 
            endGame();

        }

        const endGame = () => {
            if (players[0].getScore() > players[1].getScore()) {
                console.log(`${players[0].getName()} WINS!`)
            } else if (players[0].getScore() < players[1].getScore()) {
                console.log(`${players[1].getName()} WINS!`)
            } else {
                console.log(`TABLES!`)
            }
            startGame();
        }

        const test = (event) => {
            if (gamesNum <= 0) {
                endGame();
            } else {
                if (turnNum <= 9) {
                    const x = event.target.id[0];
                    const y = event.target.id[1];
                    if(controller.setMove(x, y)) {
                        turnNum--;
                        board.showGrid();
                        if (board.checkVictory(x, y, players[controller.getTurn()].getSymbol())) {
                            gamesNum--;
                            board.reset();
                            players[controller.getTurn()].increaseScore();
                            console.log(players[controller.getTurn()].getName() + " WINS!");
                        }
                        changeTurn();
                    }
                } else {
                    gamesNum--;
                    board.reset();
                }
            }
        }

        /*const resolveGame = () => {
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
    */
}
