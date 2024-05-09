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

        const getName = () => {
            return name;
        }

        const increaseScore = () => {
            score++;
        }

        return {getName, getSymbol, increaseScore};
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

        return {showGrid, checkPosition, changeCellSymbol};
    })(3, 3);

    const gameController = (function (board) {
        let players = [];
        let turn = 0;

        const setPlayers = (newPlayers) => {
            players = newPlayers;
        }

        const getTurn = () => {
            return turn;
        }

        const setTurn = (newTurn) => {
            turn = newTurn;
        }

        const setMove = (x, y) => {
            //console.log(x, y, board.checkPosition(x, y));
            if (board.checkPosition(x, y)) {
                board.changeCellSymbol(x, y, players[turn].getSymbol());
                return true;
            } else {
                return false;
            }
        }

        return {setMove, setPlayers, setTurn, getTurn};
    })(boardGrid);

    const player1 = createPlayer("Popo", "$-$");
    const player2 = createPlayer("Johnson", "UwU");

    const gameManager = (function (board, controller, players) {
        controller.setPlayers(players);

        for (let turnsRemaining = 9; turnsRemaining > 0;) {
            let x = +prompt("Column");
            let y = +prompt("Row");
            if(controller.setMove(x, y)) {
                if (controller.getTurn() === 0) {
                    controller.setTurn(1);
                } else {
                    controller.setTurn(0);
                }
                turnsRemaining--;
                board.showGrid();
            }
        }

        return {board, controller};
    })(boardGrid, gameController, [player1, player2]);

    console.log("main ends");
}