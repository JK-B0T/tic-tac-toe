document.addEventListener("DOMContentLoaded", main, false);

function main() {

    const boardGrid = (() => {
        const ROWS = 3;
        const COLUMNS = 3;
        let board = [];

        for (let i = 0; i < COLUMNS; i++) {
            board[i] = [];
            for (let j = 0; j < ROWS; j++) {
                board[i][j] = `${i}-${j}`;
            }
        }

        const showGrid = () => {
            let gridVisual = ""
            for (let i = 0; i < COLUMNS; i++) {
                gridVisual += `\n`;
                for (let j = 0; j < ROWS; j++) {
                    gridVisual += `${i}-${j} `;
                }
            }
            return gridVisual;
        }
        return {board, showGrid};
    })();

    const newGrid = boardGrid;
    console.log(newGrid.showGrid());
    console.log("main ends");

    function Cell () {
        this.d
    }
}