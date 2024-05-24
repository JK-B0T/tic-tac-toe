document.addEventListener("DOMContentLoaded", main, false);

function main() {

    const consoleRenderer = (() => {

        const showGrid = (grid) => {
            let visualGrid = "";
            for (let x = 0; x < grid.getHeight(); x++) {
                for (let y = 0; y < grid.getWidth(); y++) {
                    if (y === 0 && x !== 0) {
                        visualGrid += `\n`;
                    }
                    if (grid.getCell(x, y) !== null) {
                        visualGrid += `[${grid.getCell(x, y).getType()}]`;
                    } else {
                        visualGrid += `[${grid.getCell(x, y)}]`;
                    }
                }
            }
            console.log(visualGrid);
        }

        const showTurn = (turn) => {
            console.log(`-Turn ${turn}-`);
        }

        const showRound = (round) => {
            console.log(`---ROUND ${round}---`);
        }

        const showActivePlayer = (activePlayerName) => {
            console.log(`${activePlayerName}'s Turn!`);
        }

        const showTurnWinner = (winnerName) => {
            console.log(`Turn won by ${winnerName}!`);
        }

        const showWinner = (winnerName) => {
            console.log(`The Winner is ${winnerName}!`);
        }

        const showPlayersScore = (players) => {
            console.log(`${players[0].getName()}'s score: ${players[0].getScore()}\n${players[1].getName()}'s score: ${players[1].getScore()}`);
        }

        return {showGrid, showTurn, showRound, showActivePlayer, showTurnWinner, showWinner, showPlayersScore};
    })();

    const htmlRenderer = (() => {
        /*
            
        */
    })();

    const boardManager = (() => {
        let gridList = {};

        const createGrid = (name, rows, columns) => {
            let grid = [];
            for (let x = 0; x < rows; x++) {
                grid[x] = [];
                for (let y = 0; y < columns; y++) {
                    grid[x][y] = null;
                }
            }

            const fillGrid = (value) => {
                for (let x = 0; x < rows; x++) {
                    for (let y = 0; y < columns; y++) {
                        grid[x][y] = value;
                    }
                }
            }

            const getCell = (x, y) => {
                return grid[x][y];
            }

            const setCell = (x, y, value) => {
                grid[x][y] = value;
            }

            const getHeight = () => {
                return rows;
            }

            const getWidth = () => {
                return columns;
            }

            gridList[name] = {getCell, setCell, fillGrid, getHeight, getWidth};
        }

        const getGrid = (name) => {
            return gridList[name];
        }

        return {createGrid, getGrid};
    })();

    const unitManager = (() => {

        let unitPoolList = {};
        let unitFactoryList = {};

        /**
         * 
         * @param {string} typeName 
         * @param {grid} defaultGrid 
         * @param {int} poolSize 
         * @param {object} typeProperties 
         */
        const createUnitType = (typeName, defaultGrid, poolSize, typeProperties = {}) => {

            const createUnitFactory = () => {
                let id = 0;
                const createUnit = () => {
                    let faction = null;
                    let isActive = false;
                    const type = typeName;
                    const name = type + id;
                    
                    const baseUnit = {
                        getType: () => {return type;},
                            
                        getId: () => {return id;},
            
                        getName: () => {return name;},
            
                        getFaction: () => {return faction;},
    
                        setFaction: (newFaction) => {faction = newFaction;},
        
                        getActivation: () => {return isActive;},
            
                        activate: () => {isActive = true},
            
                        deactivate: () => {isActive = false},
                    };
                    id++;
                    const unitProperties = typeProperties;
                    return Object.assign({}, baseUnit, unitProperties);
                }
                
                return {createUnit}
            }
            unitFactoryList[typeName] = createUnitFactory();

            const createUnitPool = () => {
                let pool = [];

                for(let i = 0; i < poolSize; i++) {
                    pool[i] = unitFactoryList[typeName].createUnit();
                }

                const spawnUnit = (x, y, faction, grid = defaultGrid) => {
                    let unitSpawned = false;
                    for(let i = 0; i < poolSize; i++) {
                        if (!pool[i].getActivation()) {
                            pool[i].activate();
                            pool[i].setFaction(faction);
                            grid.setCell(x, y, pool[i]);
                            unitSpawned = true;
                            break;
                        }
                    }
                    if (!unitSpawned) {
                        pool.push(unitFactoryList[typeName].createUnit());
                        pool[pool.length-1].activate();
                        grid.setCell(x, y, pool[pool.length-1]);
                    }
                }
                
                const despawnUnit = (x, y, grid = defaultGrid) => {
                    unit = grid.getCell(x, y);
                    if (unit !== null) {
                        grid.setCell(x, y, null);
                        unit.deactivate();
                    }
                }

                const despawnAllUnits = (grid = defaultGrid) => {
                    for (let x = 0; x < grid.getWidth(); x++) {
                        for (let y = 0; y < grid.getHeight(); y++) {
                            despawnUnit(x, y, grid);
                        }
                    }
                }
                
                return {spawnUnit, despawnUnit, despawnAllUnits}
            }
            unitPoolList[typeName] = createUnitPool();
        }

        const getPool = (poolname) => {
            return unitPoolList[poolname];
        }

        const hasUnitType = (typeName) => {
            return unitPoolList.hasOwnProperty(typeName);
        }

        const moveUnit = (ix, iy, nx, ny) => {
            const unit = grid.getCell(ix, iy);
            grid.setCell(ix, iy, null);
            grid.setCell(nx, ny, unit);
        }

        return {createUnitType, getPool, moveUnit, hasUnitType};
    })();

    const playerManager = (() => {
       let playerList = {};

        const createPlayer = (name, faction, playerProperties = {}) => {
            let score = 0;
            let turnNum = 1;

            const basePlayer = {
                getName: () => {return name;},
    
                getFaction: () => {return faction;},

                setFaction: (newFaction) => {faction = newFaction;},

                getScore: () => {return score;},
    
                increaseScore: () => {score++;},
    
                resetScore: () => {score = 0;},

                getTurnNumber: () => {return turnNum;},

                setTurnNumber: (newTurnNum) => {turnNum = newTurnNum;},
            }

            return Object.assign({}, basePlayer, playerProperties)
        }

        const addPlayer = (name, faction, playerProperties = {}) => {
            playerList[name] = createPlayer(name, faction, playerProperties);
        }

        const getPlayers = (playersToReturn) => {
            let returningPlayers = []
            for (const playerName of playersToReturn) {
                if (playerList.hasOwnProperty(playerName)) {
                    returningPlayers.push(playerList[playerName]);
                }
            }
            return returningPlayers;
        }

        const hasPlayer = (playerName) => {
            return playerList.hasOwnProperty(playerName);
        }

        return {addPlayer, getPlayers, hasPlayer};
    })();

    const gameController = (() => {
        let players = null;
        let activePlayerIndex = 0;
        let activePlayer = null;

        const setPlayers = (newPlayers) => {
            players = newPlayers;
        }

        const getPlayers = () => {
            return players;
        }

        const getActivePlayer = () => {
            return activePlayer;
        }

        const setActivePlayer = (newPlayer) => {
            activePlayer = newPlayer;
        }

        const progressTurn = () => {
            if (activePlayer.getTurnNumber() === 1) {
                if (players[players.length-1] === activePlayer) {
                    activePlayer = players[0];
                    activePlayerIndex = 0;
                } else {
                    activePlayerIndex++;
                    activePlayer = players[activePlayerIndex];
                }
            } else {
                activePlayer.setTurnNumber(getTurnNumber()-1);
            }
        }

        return {setPlayers, getPlayers, getActivePlayer, setActivePlayer, progressTurn};
    })();

    const gameManager = (() => {
        const gameStateList = [
            "startMenu",
            "gameInProgress",
            "endGame",
        ]
        let gameState = "startMenu";

        const getGameState = () => {
            return gameState;
        }

        const updateGameState = (newGameState) => {
            if (gameStateList.find((item) => item = newGameState)) {
                gameState = newGameState;
            }
        }

        const setGameStates = (newgameStateList) => {
            gameStateList = newgameStateList;
        }


        return {getGameState, updateGameState, setGameStates};
    })();

    const ticTacToeManager = (() => {
        boardManager.createGrid("tictactoe", 3, 3);
        const grid = boardManager.getGrid("tictactoe");
        let turnsLeft = 9;
        let maxrounds = 3;
        let rounds = 1;
        let pool1 = null;
        let pool2 = null;
        const playerProperties = {
            symbol: null,
            getSymbol: function () {return this.symbol},
            setSymbol: function (newSymbol) {this.symbol = newSymbol},
        }

        const dialog = document.querySelector("dialog");
        const newGameBtn = document.getElementById("newGameBtn");
        const playBtn = document.getElementById("playBtn");
        const domCells = Array.from(document.querySelectorAll(".boardGrid button"));

        const definePlayers = () => {
            const p1Name = document.getElementById("p1Name").value;
            const p2Name = document.getElementById("p2Name").value;
            const p1Symbol = document.getElementById("p1Symbol").value;
            const p2Symbol = document.getElementById("p2Symbol").value;

            if (!playerManager.hasPlayer(p1Name)) {
                playerManager.addPlayer(p1Name, null, playerProperties);
            }
            if (!playerManager.hasPlayer(p2Name)) {
                playerManager.addPlayer(p2Name, null, playerProperties);
            }
            players = playerManager.getPlayers([p1Name, p2Name]);
            
            players[0].setSymbol(p1Symbol);
            players[1].setSymbol(p2Symbol);
            players[0].setFaction("Player1");
            players[1].setFaction("Player2");

            if (!unitManager.hasUnitType(p1Symbol)) {
                unitManager.createUnitType(p1Symbol, grid, 5);
            } 
            if (!unitManager.hasUnitType(p2Symbol)) {
                unitManager.createUnitType(p2Symbol, grid, 5);
            } 

            pool1 = unitManager.getPool(p1Symbol);
            pool2 = unitManager.getPool(p2Symbol);
            gameController.setPlayers(players);
            gameController.setActivePlayer(players[0]);
        }

        const startTicTacToeGame = () => {
            dialog.close();
            definePlayers();
            gameManager.updateGameState("gameInProgress");

            consoleRenderer.showRound(rounds);
            consoleRenderer.showTurn(turnsLeft);
            consoleRenderer.showActivePlayer(gameController.getActivePlayer().getName());
            //htmlRenderer.renderGrid(grid);
        }

        const victoryCheck = (x, y) => {
            const activePlayerSymbol = gameController.getActivePlayer().getSymbol();

            //Vertical Check
            for (let iy = 0; iy < grid.getWidth(); iy++) {
                if (grid.getCell(x, iy) === null) {
                    break;
                } else if (grid.getCell(x, iy).getType() !== activePlayerSymbol){
                    break;
                } else if (iy === 2){
                    return true;
                }
            }

            //Horizontal Check
            for (let ix = 0; ix < grid.getHeight(); ix++) {
                if (grid.getCell(ix, y) === null) {
                    break;
                } else if (grid.getCell(ix, y).getType() !== activePlayerSymbol){
                    break;
                } else if (ix === 2){
                    return true;
                }
            }

            //Diagonal Left Up-Down Check
            let iy = 0;
            for (let ix = 0; ix < grid.getHeight(); ix++) {
                if (grid.getCell(ix, iy) === null) {
                    break;
                } else if (grid.getCell(ix, iy).getType() !== activePlayerSymbol){
                    break;
                } else if (ix === 2){
                    return true;
                }
                iy++;
            }

            //Diagonal Right Up-Down Check
            iy = 2;
            for (let ix = 0; ix < grid.getWidth(); ix++) {
                if (grid.getCell(ix, iy) === null) {
                    break;
                } else if (grid.getCell(ix, iy).getType() !== activePlayerSymbol){
                    break;
                } else if (ix === 2){
                    return true;
                }
                iy--;
            }

            return false;
        }

        const resolveTurn = (e) => {
            if (gameManager.getGameState() === "gameInProgress") {
                const x = e.target.id[0];
                const y = e.target.id[1]
                const cell = grid.getCell(x, y);
                if (cell === null) {
                    const activePlayer = gameController.getActivePlayer();
                    const pool = unitManager.getPool(activePlayer.getSymbol());
                    pool.spawnUnit(x, y);
                    //Render html grid
                    consoleRenderer.showGrid(grid);
                    turnsLeft--;
    
                    if (victoryCheck(x, y)) {
                        //Render html turn win
                        consoleRenderer.showTurnWinner(activePlayer.getName());
                        activePlayer.increaseScore();
                        consoleRenderer.showPlayersScore(gameController.getPlayers());
                        
                        if (rounds >= maxrounds) {
                            endGame();
                        } else {
                            resetRound();
                        }
                    } else if (turnsLeft === 0) {
                        //Render html turn win
                        consoleRenderer.showTurnWinner("no one");
                        
                        if (rounds >= maxrounds) {
                            endGame();
                        } else {
                            resetRound();
                        }
                    }
                    
                    if (gameManager.getGameState() === "gameInProgress") {
                        gameController.progressTurn();
                        consoleRenderer.showTurn(turnsLeft);
                        consoleRenderer.showActivePlayer(gameController.getActivePlayer().getName());
                    }
                } else {
                    //Show Error
                }
            } else {
                console.log("Game is not in progress");
            }
        }

        const resetRound = () => {
            turnsLeft = 9;
            grid.fillGrid(null);
            pool1.despawnAllUnits(grid);
            pool2.despawnAllUnits(grid);
            rounds++;
            if (gameManager.getGameState() === "gameInProgress") {
                consoleRenderer.showRound(rounds);
            }
        }

        const endGame = () => {
            gameManager.updateGameState("endGame");
            players = gameController.getPlayers();
            if (players[0].getScore() > players[1].getScore()) {
                consoleRenderer.showWinner(players[0].getName());
            } else if (players[0].getScore() < players[1].getScore()) {
                consoleRenderer.showWinner(players[1].getName());
            } else {
                consoleRenderer.showWinner("no one");
            }
            players[0].resetScore();
            players[1].resetScore();
            resetRound();
            rounds = 1;
        }

        playBtn.addEventListener("click", startTicTacToeGame, false);
        newGameBtn.addEventListener("click", () => {dialog.showModal()}, false);
        domCells.map((cell) => {cell.addEventListener("click", resolveTurn, false)});
        return {startTicTacToeGame, resolveTurn};
    })();

}