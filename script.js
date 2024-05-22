document.addEventListener("DOMContentLoaded", main, false);

function main() {

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
        /*
        - Creates a unitPool dictionary.
        - Creates a unitFactory dictionary.

        ___createUnitType(unitTypeProperties, typeName, poolSize)___
        ------------This Could and maybe must be separeted into different methods---------
        - Receives (unit type properties), (type name) and (pool size).
        - Creates a factory and a pool where are instances for that unit are storage.
            -Factory uses unit type properties to define the special traits of the unit type, it also adds the common properties.
             faction, type(uses typeName parameter), id(number that goes up everytime a new instance is created),
             name(typeName + id), isActive(pool activation value), defaultGrid(grid in which it acts by default).
            - If the game request more units that deactivated units are in the pool, new intances are created and added to the pool with the adecuate unit factory.
        - Adds factories and pools to their dictionaries where the type name matches the factory and pool key values.
        - Uses Unit Factory to create a number of intances equal to the pool size parameter.

        ___spawnUnit(x, y, grid = unit.defaultGrid, type)___
        - Receives coorditanes, the grid in which to spawn and the unit type.
        - If the space is avalible, sets the cell value to a new unit from the specified type and then activates it.

        ___despawnUnit(x, y, grid = unit.defaultGrid)___
        - Receives coorditanes, the grid in which to despawn.
        - If the space is not avalible, deactivates the unit in it and then sets the cell value to null.

        ___moveUnit(x, y, unit)___
        - if the unit is active, sets it to the new specified coordinates and eliminates it from the last coordinates
        */
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
            
                        changePos: (x, y, grid = defaultGrid) => {
                            if (isActive !== true) {
                                baseUnit.activate();
                            } 
                            grid.setCell(x, y, baseUnit);
                        },
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
                
                return {spawnUnit, despawnUnit}
            }
            unitPoolList[typeName] = createUnitPool();
        }

        const getPool = (poolname) => {
            return unitPoolList[poolname];
        }

        return {createUnitType, getPool};
    })();

    const consoleRender = (() => {

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

    boardManager.createGrid("test", 3, 3);
    const gridTest = boardManager.getGrid("test");
    consoleRender.showGrid(gridTest);

    const monkeProperties = {
        alive: true,
        bananas: 10,
        eatBananas: function (num) {
            for (let i = 0; i < num; i++) {
                this.bananas--;
            }

            if (this.bananas <= 0) {
                this.alive = false;
            }
        },
    }

    unitManager.createUnitType("Monke", gridTest, 20, monkeProperties);
    const monkePool = unitManager.getPool("Monke");

    monkePool.spawnUnit(1,1,"GoodMonke");
    const goodMonke = gridTest.getCell(1,1);
    consoleRender.showGrid(gridTest);
    console.log(goodMonke.getName(), goodMonke.alive, goodMonke.getFaction(), goodMonke.getActivation());

    monkePool.spawnUnit(2,2,"BadMonke");
    const badMonke = gridTest.getCell(2,2);
    consoleRender.showGrid(gridTest);
    console.log(badMonke.getName(), badMonke.alive, badMonke.getFaction(), badMonke.getActivation());

    goodMonke.eatBananas(3);
    badMonke.eatBananas(10);
    console.log(goodMonke.getName(), goodMonke.alive, goodMonke.getFaction(), goodMonke.bananas);
    console.log(badMonke.getName(), badMonke.alive, badMonke.getFaction(), badMonke.bananas);

    monkePool.despawnUnit(2,2);
    console.log(goodMonke.getName(), goodMonke.alive, goodMonke.getFaction(), goodMonke.getActivation(), goodMonke.bananas);
    console.log(badMonke.getName(), badMonke.alive, badMonke.getFaction(), badMonke.getActivation(), badMonke.bananas);
/*
    function createEntity (id, type, gridPropertyType = null, pos = null) {

        const changePos = (newPos, property) => {
            pos = newPos;
            if (pos !== null) {
                board.emptyCellProperty(pos, property);
            }
            board.fillCellProperty(pos, gridPropertyType || property, type + id);
        }

        const getName = () => {
            return gridPropertyType + id;
        }

        const getType = () => {
            return type;
        }

        const getPos = () => {
            return pos;
        }

        const resetPos = () => {
            pos = null;
        }
        return {changePos, getName, getType, getPos, resetPos};
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

        const getNextUnit = (type) => {
            for (let i = 0; i < unitList[type].length; i++) {
                if (unitList[type][i].getPos() === null) {
                    return unitList[type][i];
                }
            }
        }

        const resetAllUnits = (type) => {
            for (let i = 0; i < unitList[type].length; i++) {
                if (unitList[type][i].getPos() !== null) {
                    board.emptyCellProperty(unitList[type][i].getPos());
                    unitList[type][i].resetPos();
                }
            }
        }

        return {getName, addUnitType, addUnits, getUnit, getNextUnit, resetAllUnits};
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

        const getScore = () => {
            return score;
        }

        return {getName, getFactionName, increaseScore, resetScore, getScore};
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
            if(getPlayerByName(name) == undefined) {
                const player = createPlayer(name, faction)
                players.push(player);
            }
        }

        const getPlayerByName = (name) => {
            return players.find((player) => {
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
                
                activePlayer = playerManager.getPlayerByName(p1Name.value);
                gameManager.startGame(3);
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

        const resetRound = () => {
            turnsLeft = 9;
            board.resetGridProperty(boardProperty);
            factionManager.getFaction(playerManager.getPlayerById(0).getFactionName()).resetAllUnits(playerManager.getPlayerById(0).getFactionName());
            factionManager.getFaction(playerManager.getPlayerById(1).getFactionName()).resetAllUnits(playerManager.getPlayerById(1).getFactionName());
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

           return true;
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

    const gameManager = (() => {
        let gameInProgress = false;
        let roundLeft = 0;

        const game = () => {
            //Not modular design
            ticTacToeManager.startTicTacToeGame(playerManager.getPlayerById(0), playerManager.getPlayerById(1));  
        }
        
        const resolveTurn = (e) => {
            //Not modular design
            return ticTacToeManager.resolveTurn(e);
        }

        const startGame = (roundNum) => {
            gameInProgress = true;
            roundLeft = roundNum;
            game();
        }

        const startRound = (e) => {
            if (gameInProgress) {
                if (resolveTurn(e)) {
                    roundLeft--;
                    console.log(roundLeft);

                    if (roundLeft <= 0) {
                        endGame();
                    }
                }
            } else {
                console.log("No game in progress");
            }
        }

        const endGame = () => {
            gameInProgress = false;
            if (playerManager.getPlayerById(0).getScore() > playerManager.getPlayerById(1).getScore()) {
                console.log(playerManager.getPlayerById(0).getName(), "Wins the Game!")
            } else if (playerManager.getPlayerById(0).getScore() < playerManager.getPlayerById(1).getScore()) {
                console.log(playerManager.getPlayerById(1).getName(), "Wins the Game!")
            } else {
                console.log("The game ends with tables!")
            }
            playerManager.getPlayerById(0).resetScore();
            playerManager.getPlayerById(1).resetScore();
        }

        return {startGame, startRound};
    })();
    */
}
