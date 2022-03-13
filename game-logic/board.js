const { resourcesTypes, numbersArr, resourcesArr } = require("./utils/constants");
const { mixArray, getDistance } = require("./utils/helperFunctions")
const Tile = require("./tile");

class Board {
    #tileRadius
    constructor(tileRadius) {
        this.#tileRadius = tileRadius;
        this.roads = [];
        this.junctions = [];
        this.longestRoad = [];
        this.tiles = getTilesData(tileRadius);
    }

    //Returns the status of the requested junction, if exists.
    getJunctionStatus(x, y) {
        if (this.doCoordinatesExist(x, y)) {
            this.junctions.forEach(junction => {
                if (junction.x === x && junction.y === y) {
                    return junction.status;
                }
            });
            return "free";
        }
        else {
            throw "Invalid junction coordinates"
        }
    }

    //Returns the status of the requested road, if exists.
    getRoadStatus(startX, startY, endX, endY) {
        if (this.doCoordinatesExist(startX, startY) && this.doCoordinatesExist(endX, endY)) {
            this.roads.forEach(road => {
                if (road.startX === startX && road.startY === startY && road.endX === endX && road.endY === endY) {
                    return road.status;
                }
            });
            return "free";
        }
        else {
            throw "Invalid road coordinates"
        }
    }

    moveRobber(row, cell) {
        this.tiles.forEach(tile => {
            if (tile.row === row && tile.cell === cell) {
                if (tile.isRobber) {
                    throw "Robber already on tile"
                }
                tile.isRobber = true;
            }
        });

        //Remove robber from where it was previously
        this.tiles.forEach(tile => {
            if (tile.row !== row && tile.cell !== cell) {
                if (tile.isRobber) {
                    this.isRobber = false;
                }
            }
        });
    }

    //Validates junction input and adds it to the board if valid.
    addJunction(player, x, y, type) {
        if (this.#canPlaceSettelment(player, x, y)) {
            const newJunctionObj = {
                x: x,
                y: y,
                player: player,
                type: type,
            }
            this.roads = [...this.roads, newJunctionObj];
        }
    }

    //Validates if the settelment can be build
    #canPlaceSettelment(player, x, y) {
        if (!this.doCoordinatesExist(x, y)) { //Checks if the coordinates are valid
            throw "Invalid junction coordinates";
        }
        this.junctions.forEach(junction => { //Check if the junction is free
            if (junction.x === x && junction.y === y) {
                throw "Junction already accupied";
            }
        });
        if (!this.#isJunction2RoadsApart(x, y)) { //Check if the junction isnt too close to any other junctions
            throw "Junction is to close to another settelment";
        }
        if (!this.#isJunctionConnectedToPlayer(player, x, y)) { //Check if the junction is connected to a road build by the same player
            throw "Junction is not connected to any road build by player " + player;
        }
        return true;
    }

    #isJunction2RoadsApart(x, y) {
        this.junctions.forEach(junction => {
            if (Math.round(getDistance(junction.x, junction.y, x, y)) === this.#tileRadius) {
                return false;
            }
        })
        return true;
    }

    #isJunctionConnectedToPlayer(player, x, y) {
        this.roads.forEach(road => {
            if (road.startX === x && road.startY === y && road.status === player) {
                return true;
            }
            if (road.endX === x && road.endX === y && road.status === player) {
                return true;
            }
        })
        return false;
    }

    //Validates road input and adds it to the board if valid.
    addRoad(player, startX, startY, endX, endY) {
        if (this.#canPlaceRoad(player, startX, startY, endX, endY)) {
            const newRoadObj = {
                startX: startX,
                startY: startY,
                endX: endX,
                endY: endY,
                player: player,
            }
            this.junctions = [...this.junctions, newRoadObj];
            this.#findLongestRoad();
        }
    }

    #canPlaceRoad(player, startX, startY, endX, endY) {
        //Checks if the coordinates are valid
        if (!this.doCoordinatesExist(startX, startY) || !this.doCoordinatesExist(endX, endY) || Math.round(getDistance(startX, startY, endX, endY)) !== this.#tileRadius) {
            throw "Invalid road";
        }
        //Check if the road is free
        if (this.getRoadStatus(startX, startY, endX, endY) !== "free") {
            throw "Road already accupied";
        }
        //Cheks if the road is connected to another player
        if (!this.#isConnectedToJunction(player, startX, startY, endX, endY) || !this.#isConnectedToRoad(player, startX, startY, endX, endY)) {
            throw "Cant place road here"
        }
        return true;
    }

    #isConnectedToJunction(player, startX, startY, endX, endY) {
        this.junctions.forEach(junction => {
            if (junction.x === startX && junction.y === startY && junction.status === player) {
                return true;
            }
            if (junction.x === endX && junction.y === endY && junction.status === player) {
                return true;
            }
        })
        return false;
    }

    #isConnectedToRoad(player, startX, startY, endX, endY) {
        this.roads.forEach(road => {
            if (road.status === player) {
                if (road.startX === startX && road.startY === startY) {
                    return true;
                }
                if (road.endX === endX && road.endY === endY) {
                    return true;
                }
                if (road.endX === startX && road.endY === startY) {
                    return true;
                }
                if (road.startX === endX && road.startY === endY) {
                    return true;
                }
            }
        })
        return false;
    }

    #findLongestRoad() {
        // this.roads.forEach(road => {
        //     let roadLength = 1;
        //     this.#findConnectedRoads(road);

        // })
    }

    #findConnectedRoads(roadInput) {
        const { player, startX, startY, endX, endY } = roadInput;
        const connectedRoads = [];
        this.roads.forEach(road => {
            if (road.status === player) {
                if (road.startX === startX && road.startY === startY && road.endX !== endX && road.endX !== endY) {
                    connectedRoads.push(road);
                }
                if (road.startX !== startX && road.startY !== startY && road.endX === endX && road.endX === endY) {
                    connectedRoads.push(road);
                }
                if (road.startX === endX && road.startY === endY && road.endX !== startX && road.endX !== startY) {
                    connectedRoads.push(road);
                }
                if (road.endX === startX && road.endY === startY && road.startX !== endX && road.startY !== endY) {
                    connectedRoads.push(road);
                }
            }
        })
        return connectedRoads;
    }

    doCoordinatesExist(x, y) {
        let retValue = true;
        for (let tile of this.tiles) {
            for (let coord in tile.coordinates) {
                if (coord.x !== x && coord.y !== y) {
                    retValue = false;
                }
            }
        }
        return retValue;
    }
}

//Each tiles should contain: coordinates, number, resource
function getTilesData(tileRadius) {
    const resources = mixArray(resourcesArr);
    const numbers = mixArray(numbersArr);

    const tilesData = resources.map(tile => {
        if (tile === resourcesTypes.DESERT) {
            return { resource: tile, number: undefined, isRobber: false };
        } else {
            return { resource: tile, number: numbers.pop(), isRobber: false }
        }
    });
    const rowLengths = [3, 4, 5, 4, 3];
    let tileCount = 0;

    for (let i = 0; i < rowLengths.length; i++) {
        for (let j = 0; j < rowLengths[i]; j++) {
            tilesData[tileCount].coordinates = calulateCoordinatesByBoardPosition(i, j, tileRadius);
            tilesData[tileCount].row = i;
            tilesData[tileCount].cell = j;
            tileCount++;
        }
    }
    return tilesData;
}

module.exports = Board;