document.addEventListener("DOMContentLoaded", main, false);

function main() {

    /*
    ____unitManager____
    - 
    - 
    - 
    - 
    - 
    */
/*
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

        const getUnit = (type, number = 1) => {
            return unitList[type][number-1];
        }
        return {getName, addUnitType, addUnits, getUnit};
    }

    function createPlayer (name, faction) {
        let score = 0;

        const getName = () => {
            return name; 
        }

        const getFactionName = () => {
            return faction; 
        }

        const increaseScore = () => {
            score += 1;
        }

        const resetScore = () => {
            score = 0;
        }

        return {getName, getFactionName, increaseScore, resetScore};
    }

    const factionManager = (() => {
        let factionList = {};

        const addFaction = (name) => {
            factionList[name] = createFaction(name);
            return factionList[name];
        }

        const getFaction = (name) => {
            return factionList[name];
        }
        
        return {addFaction, getFaction};
    })();

    const playerManager = (() => {
        let players = [];

        const addPlayer = (name, faction) => {
            if(getPlayerByName(name)[0] == undefined) {
                const player = createPlayer(name, faction)
                players.push(player);
            }
        }

        const getPlayerByName = (name) => {
            return players.filter((player) => {
                return player.getName() == name;
            });
        }

        const getPlayerById = (id) => {
            return players[id];
        }

        return {addPlayer, getPlayerByName, getPlayerById};
    })();

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
                playerManager.addPlayer(p1Name.value, p1Symbol.value);
                playerManager.addPlayer(p2Name.value, p2Symbol.value);
                
                activePlayer = playerManager.getPlayerByName(p1Name.value).getName();
                console.log(activePlayer)
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

        const resetRound = () => {
            p1PieceOrder = 1;
            p2PieceOrder = 1;
            board.resetGridProperty(boardProperty);
        }

        const startTicTacToeGame = (player1, player2) => {
            player1Faction = factionManager.addFaction(player1.getFactionName());
            player2Faction = factionManager.addFaction(player2.getFactionName());
        
            player1Faction.addUnitType(player1.getFactionName());
            player2Faction.addUnitType(player2.getFactionName());

            player1Faction.addUnits(player1.getFactionName(), boardProperty, 5);
            player2Faction.addUnits(player2.getFactionName(), boardProperty, 5);
        }

        const victoryCheck = () => {
        
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

           return true;
        }

        const resolveTurn = (e) => {
            console.log("Turn made");
            if (turnsLeft !== 0 && victoryCheck()) {
                const pos = [e.target.id[0], e.target.id[1]];
                const cell = board.getCellProperty(e.target.id[0], e.target.id[1], boardProperty)
                console.log(board.getCellProperty(pos[0], pos[1], boardProperty));
                if (cell == null) {
                    console.log(gameController.getActivePlayer().getName());
                    const activePlayer = gameController.getActivePlayer().getFactionName();
                    board.fillCellProperty(pos, boardProperty, activePlayer)
                }
                return false;
            } else if (turnsLeft !== 0) {
                console.log("Tables");
                resetRound();
                return true;
            } else {
                console.log(`${gameController.getActivePlayer().getName()} Wins!`);
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
            ticTacToeManager.startTicTacToeGame(playerManager.getPlayerById(0), playerManager.getPlayerById(1));  
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
    */
}
