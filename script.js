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
                        visualGrid += `[${grid.getCell(x, y).getName()}]`;
                    } else {
                        visualGrid += `[${grid.getCell(x, y)}]`;
                    }
                }
            }
            console.log(visualGrid);
        }

        return {showGrid};
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

        const moveUnit = (ix, iy, nx, ny) => {
            const unit = grid.getCell(ix, iy);
            grid.setCell(ix, iy, null);
            grid.setCell(nx, ny, unit);
        }

        return {createUnitType, getPool, moveUnit};
    })();

    const playerManager = (() => {
       let playerList = {};

        const createPlayer = (name, faction, playerProperties = {}) => {
            let score = 0;
            let turnNum = 1;

            const basePlayer = {
                getName: () => {return name;},
    
                getFaction: () => {return faction;},
    
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
                console.log(playerName)
                if (playerList.hasOwnProperty(playerName)) {
                    returningPlayers.push(playerList[playerName]);
                }
            }
            return returningPlayers;
        }

        return {addPlayer, getPlayers};
    })();

    const gameController = (() => {
        let players = null;
        let activePlayerIndex = 0;
        let activePlayer = null;

        const setPlayers = (newPlayers) => {
            players = newPlayers;
        }

        const getActivePlayer = () => {
            return activePlayer;
        }

        const progressTurn = () => {
            if (activePlayer.getTurnNumber() === 0) {
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

        const registerInput = (e) => {
            gameManager.startRound(e);
        }

        //Not modular design
        const p1Name = document.getElementById("p1Name");
        const p2Name = document.getElementById("p2Name");
        const p1Symbol = document.getElementById("p1Symbol");
        const p2Symbol = document.getElementById("p2Symbol");
        const newGameBtn = document.getElementById("newGameBtn");
        const playBtn = document.getElementById("playBtn");
        playBtn.addEventListener("click", definePlayers, false);

        const domCells = Array.from(document.querySelectorAll(".boardGrid button"));
        domCells.map((cell) => {cell.addEventListener("click", registerInput, false)});

        return {setPlayers, getActivePlayer, progressTurn};
    })();

    const gameManager = (() => {
        let gameState = "startMenu";
        let rounds = 0;
        let gameFunction = null;

        const getGameState = () => {
            return gameState;
        }

        const setGameState = (newGameState) => {
            gameState = newGameState;
        }
        
        const startGame = (gameStartFunction, players, newRounds = 1) => {
            rounds = newRounds;
            gameState = "gameInProgress";
            gameFunction = gameStartFunction(players);
        }

        const startTurn = (activePlayer) => {
            let roundState = null;
            if (gameFunction()) {
                roundState = gameController.progressTurn();
            }
            if (roundState === "end") {
                if (rounds <= 0) {
                    endGame();
                } else {
                    startRound();
                }
            }
        }

        const startRound = () => {
            roundState
        }

        const endGame = () => {

        }

        return {getGameState, setGameState, startGame, startTurn};
    })();

    const ticTacToeManager = (() => {
        const grid = boardManager.createGrid("tictactoe", 3, 3);
        let turnsLeft = 9;

        const victoryCheck = (pos) => {
            const x = pos[0];
            const y = pos[1];
            let isWin = true;
            let grid = board.getGrid();
            console.log(grid[x][y])
            for (let iy = 0; iy < grid.length; iy++) {
                if (!(grid[x][iy].getType() === symbol)) {
                    isWin = false;
                    break;
                }
            }
            if (isWin === true) {
                return true;
            } else {
                isWin = true;
            }

            for (let ix = 0; ix < grid[ix].length; ix++) {
                if (!(grid[ix][y].getType() === symbol)) {
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
            for (let ix = 0; ix < grid[ix].length; ix++) {
                if (!(grid[ix][iy].getType() === symbol)) {
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
            for (let ix = 0; ix < grid[ix].length; ix++) {
                if (!(grid[ix][iy].getType() === symbol)) {
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

        const resetRound = () => {
            turnsLeft = 9;
            grid.fillGrid(null);
            factionManager.getFaction(playerManager.getPlayerById(0).getFactionName()).resetAllUnits(playerManager.getPlayerById(0).getFactionName());
            factionManager.getFaction(playerManager.getPlayerById(1).getFactionName()).resetAllUnits(playerManager.getPlayerById(1).getFactionName());
        }

        const startTicTacToeGame = (players) => {
            player1Faction = factionManager.addFaction(player1.getFactionName());
            player2Faction = factionManager.addFaction(player2.getFactionName());
        
            player1Faction.addUnitType(player1.getFactionName());
            player2Faction.addUnitType(player2.getFactionName());

            player1Faction.addUnits(player1.getFactionName(), boardProperty, 5);
            player2Faction.addUnits(player2.getFactionName(), boardProperty, 5);
        }

        const resolveTurn = (e) => {
            const pos = [e.target.id[0], e.target.id[1]];
            const cell = board.getCellProperty(e.target.id[0], e.target.id[1], boardProperty)
            if (cell == null) {
                const unit = factionManager.getFaction(gameController.getActivePlayer().getFactionName()).getNextUnit(gameController.getActivePlayer().getFactionName())
                const activePlayer = gameController.getActivePlayer();
                unit.changePos(pos, boardProperty, activePlayer);
                consoleRender.showGrid(board, boardProperty);

                if(gameController.getActivePlayer() == playerManager.getPlayerById(0)) {
                    gameController.setActivePlayer(playerManager.getPlayerById(1));
                } else {
                    gameController.setActivePlayer(playerManager.getPlayerById(0));
                }

                if (victoryCheck(pos)){
                    console.log(`${gameController.getActivePlayer().getName()} Wins!`);
                    gameController.getActivePlayer().increaseScore();
                    resetRound();
                    return true;
                }

                turnsLeft--;
                if (turnsLeft === 0) {
                    console.log("Tables");
                    resetRound();
                    return true;
                }

                return false;
            }
        }

        const endTurn = () => {
            console.log("Turn made");
            if (turnsLeft !== 0) {
                
            }
        }
        return {startTicTacToeGame, resolveTurn};
    })();

}