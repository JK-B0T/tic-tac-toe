document.addEventListener("DOMContentLoaded", main, false);

function main() {

    function createEntity (id, type, gridPropertyType = null, pos = null) {

        const changePos = (x, y, property) => {
            if (pos !== null) {
                board.emptyCellProperty(pos, property);
            }
            pos = [x, y];
            board.fillCellProperty(pos, gridPropertyType || property, type + id);
        }

        const getName = () => {
            return gridPropertyType + id;
        }

        const getType = () => {
            return type;
        }
        return {changePos, getName, getType};
    }

    function createFaction (name) {
        let unitList = {};

        const getName = () => {
            return name; 
        }

        const addUnitType = (type) => {
            unitList[type] = []; 
        }

        const addUnits = (type, gridProperty, number = 1) => {
            for (let i = 0; i < number; i++) {
                unitList[type].push(createEntity(unitList[type].length+1, type, gridProperty)); 
            }
        }

        const selectUnit = (type, number = 1) => {
            return unitList[type][number-1];
        }
        return {getName, addUnitType, addUnits, selectUnit};
    }

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

        const addGridProperty = (property) => {
            for (let x = 0; x < rows; x++) {
                for (let y = 0; y < columns; y++) {
                    grid[x][y][property] = null;
                }
            }
        }

        const resetGridProperty = (property) => {
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
            return grid[x][y][property];
        }

        const fillCellProperty = (pos, property, value) => {
            grid[pos[0]][pos[1]][property] = value;
        }

        const emptyCellProperty = (pos, property) => {
            grid[pos[0]][pos[1]][property] = null;
        }

        createGrid(rows, columns);
        addGridProperty("entity");
        return {getGrid, addGridProperty, resetGridProperty, getCellProperty, fillCellProperty, emptyCellProperty};
    })(3, 3);

    const consoleRender = (() => {

        const showGrid = (board, property) => {
            let visualGrid = "";
            for (let x = 0; x < board.getGrid().length; x++) {
                x !== 0 ? visualGrid += "\n" : false;
                for (let y = 0; y < board.getGrid()[0].length; y++) {
                    if (board.getCellProperty(x, y, property) instanceof createEntity) {
                        visualGrid += `[${board.getCellProperty(x, y, property).getName()}]`;
                    }
                    visualGrid += `[${board.getCellProperty(x, y, property)}]`;
                }
            }
            console.log(visualGrid);
        }

        return {showGrid};
    })();

    const playersManager = (() => {
        let players = []

        const createPlayer = (name, faction) => {
            if(getPlayerByName(name)[0] == undefined) {
                players.push({name: name, faction: faction, score: 0});
            }
        }

        const getPlayerByName = (name) => {
            return players.filter((player) => {
                return player.name == name;
            });
        }

        const getPlayerById = (id) => {
            return players[id];
        }

        const increaseScore = (id) => {
            return players[id].score += 1;
        }

        const resetScore = (id) => {
            return players[id].score = 0;
        }

        return {createPlayer, getPlayerByName, getPlayerById, increaseScore, resetScore};
    })();

    const gameController = (() => {

        let activePlayer = null;

        const registerInput = (e) => {
            gameManager.startRound(e);
        }

        const getActivePlayer = () => {
            return activePlayer;
        }

        const setActivePlayer = (player) => {
            activePlayer = player;
        }

        const definePlayers = () => {
            //Not modular design
            if (p1Name.value != "" && p2Name.value != "" && p1Symbol.value != "" && p2Symbol.value != "") {
                playersManager.createPlayer(p1Name.value, p1Symbol.value);
                playersManager.createPlayer(p2Name.value, p2Symbol.value);
                
                activePlayer = playersManager.getPlayerByName(p1Name.value);
                gameManager.startGame();
            } else {
                console.log("No");
            }
        }

        //Not modular design
        const p1Name = document.getElementById("p1Name");
        const p2Name = document.getElementById("p2Name");
        const p1Symbol = document.getElementById("p1Symbol");
        const p2Symbol = document.getElementById("p2Symbol");
        const playBtn = document.getElementById("playBtn");
        playBtn.addEventListener("click", definePlayers, false);

        const domCells = Array.from(document.querySelectorAll("section button"));
        domCells.map((cell) => {cell.addEventListener("click", registerInput, false)});

        return {getActivePlayer, setActivePlayer};
    })();

    const ticTacToeManager = (() => {
        boardProperty = "ticTacToe"
        board.addGridProperty(boardProperty);
        let turnsLeft = 9;
        let p1PieceOrder = 1;
        let p2PieceOrder = 1;
        const player1Faction = null;
        const player2Faction = null;
        let factions = null;

        const resetRound = (player1, player2) => {
            p1PieceOrder = 1;
            p2PieceOrder = 1;
            board.resetGridProperty(boardProperty);
        }

        const startTicTacToeGame = (player1, player2) => {
            player1Faction = createFaction(player1.faction);
            player2Faction = createFaction(player2.faction);
            factions = [player1Faction, player2Faction];
        
            player1Faction.addUnitType(player1.faction);
            player2Faction.addUnitType(player2.faction);
        
            player1Faction.addUnits(player1.faction, boardProperty, 5);
            player2Faction.addUnits(player2.faction, boardProperty, 5);
        }

        const victoryCheck = () => {
            /*
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
            */
           return true;
        }

        const resolveTurn = (e) => {
            console.log("Turn made");
            if (turnsLeft !== 0 && victoryCheck()) {
                const pos = [e.target.id[0], e.target.id[1]];
                const cell = board.getCellProperty(e.target.id[0], e.target.id[1], boardProperty)
                console.log(board.getCellProperty(pos[0], pos[1], boardProperty));
                if (cell == null) {
                    board.fillCellProperty(pos, boardProperty, factions[getActivePlayer()])
                }
                return false;
            } else if (turnsLeft !== 0) {
                console.log("Tables");
                resetRound();
                return true;
            } else {
                console.log(`${gameController.getActivePlayer()} Wins!`);
                gameController.getActivePlayer().increaseScore();
                resetRound();
                return true;
            }
        }

        const endTurn = () => {
            console.log("Turn made");
            if (turnsLeft !== 0) {
                
            }
        }
        return {startTicTacToeGame, resolveTurn};
    })();

    const gameManager = (() => {
        let gameInProgress = false;
        let roundLeft = 0;

        const game = () => {
            //Not modular design
            ticTacToeManager.startTicTacToeGame(playersManager.getPlayerById(0), playersManager.getPlayerById(1));  
        }
        
        const resolveTurn = (e) => {
            //Not modular design
            ticTacToeManager.resolveTurn(e);
        }

        const startGame = (roundNum) => {
            gameInProgress = true;
            roundLeft = roundNum;
            game();
        }

        const startRound = (e) => {
            if (gameInProgress) {
                if (roundLeft !== 0) {
                    resolveTurn(e) ? roundLeft-- : false;
                } else {
                    endGame();
                }
            } else {
                console.log("No game in progress");
            }
        }

        const endGame = () => {
            if (gameInProgress) {

            } else {
                console.log("No game in progress");
            }
        }

        return {startGame, startRound};
    })();

    /*
    playerX = createFaction("PlayerX");
    playerO = createFaction("PlayerO");

    playerX.addUnitType("X");
    playerO.addUnitType("O");

    playerX.addUnits("X", "entity", 5);
    playerO.addUnits("O", "entity", 5);

    playerX.selectUnit("X", 1).changePos(0,0, "entity");
    playerX.selectUnit("X", 2).changePos(1,0, "entity");
    playerX.selectUnit("X", 3).changePos(2,1, "entity");
    playerX.selectUnit("X", 4).changePos(2,2, "entity");
    playerO.selectUnit("O", 1).changePos(0,2, "entity");
    playerO.selectUnit("O", 2).changePos(1,2, "entity");
    playerO.selectUnit("O", 3).changePos(2,0, "entity");
    playerO.selectUnit("O", 3).changePos(1,1, "entity");

    consoleRender.showGrid(board, "entity");
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
