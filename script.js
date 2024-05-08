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
        score = 0;

        const getSymbol = () => {
            return symbol;
        }

        const increaseScore = () => {
            score++;
        }

        return {name, getSymbol, increaseScore};
    }

    const boardGrid = (function (rows, columns) {
        let grid = [];

        for (let i = 0; i < columns; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                grid[i][j] = createCell("");
            }
        }

        const showGrid = () => {
            let gridVisual = ""
            for (let i = 0; i < columns; i++) {
                for (let j = 0; j < rows; j++) {
                    gridVisual += `[${grid[i][j].getSymbol()}] `;
                }
                gridVisual += `\n`;
            }
            return gridVisual;
        }

        return {grid, showGrid};
    })(3, 3);

    const gameController = (function (board) {
        let player = {};

        const checkPosition = (x, y) => {
            board.grid[x][y].getSymbol() == "" ? true : false;
        }

        const setPlayer = (newPlayer) => {
            player = newPlayer;
        }

        const setMove = (x, y) => {
            console.log(x, y)
            if (checkPosition(x, y)) {
                board.grid[x][y].setSymbol(player.getSymbol());
                console.log(x, y, board.grid[x][y].getSymbol(), player.getSymbol(), player)
            } else {
                return false;
            }1
        }

        return {setMove, setPlayer};
    })(boardGrid);

    const player1 = createPlayer("Popo", "$-$");
    const player2 = createPlayer("Johnson" , "UwU");

    const gameManager = (function (board, controller, players) {
        controller.setPlayer(players.player1);
        console.log(players.player1);
        for (let i = 0; i < 9; i++) {1
            let x = +prompt("Column");
            let y = +prompt("Row");
            controller.setMove(x, y);
            board.showGrid();
        }

        return {board, controller};
    })(boardGrid, gameController, {player1, player2});

    console.log(gameManager.board.showGrid());
    console.log("main ends");
}