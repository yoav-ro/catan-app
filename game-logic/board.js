const { resourcesTypes, numbersArr, resourcesArr, pieceTypes } = require("./utils/constants");
const { mixArray, getDistance } = require("./utils/helperFunctions")
const Tile = require("./tile");

class Board {
    #tileRadius
    constructor(tileRadius) {
        this.#tileRadius = tileRadius;
        this.roads = [];
        this.longestRoad = [];
        this.tiles = getTilesData(tileRadius);
    }

    //Returns the status of the requested junction, if exists.
    getJunctionStatus(x, y) {
        try {
            if (this.doCoordinatesExist(x, y)) {
                this.tiles.forEach(tile => {
                    if (tile.doesHaveJunction(x, y)) {
                        const status = tile.getJunctionStatus(x, y);
                        return status;
                    }
                });
            } else {
                throw "Invalid coordinates";
            }
        } catch (error) {
            return { message: "Error: " + error };
        }
    }

    //Returns the status of the requested road, if exists.
    getRoadStatus(startX, startY, endX, endY) {
        try {
            if (this.doCoordinatesExist(startX, startY) && this.doCoordinatesExist(endX, endY)) {
                this.roads.forEach(road => {
                    if (road.startX === startX && road.startY === startY && road.endX === endX && road.endY === endY) {
                        return road.status;
                    }
                });
                return "free";
            }
        } catch (error) {
            return { message: "Error: " + error };
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
        try {
            if (this.#canPlaceSettelment(player, x, y, type)) {
                const newJunctionObj = {
                    x: x,
                    y: y,
                    player: player,
                    type: type,
                }
                this.roads = [...this.roads, newJunctionObj];
                this.#findLongestRoad();
            }
        } catch (error) {
            return { message: "Error: " + error }
        }
    }

    //Validates if the settelment can be build
    #canPlaceSettelment(player, x, y, newPieceType) {
        if (!this.doCoordinatesExist(x, y)) { //Checks if the coordinates are valid
            throw "Invalid junction coordinates";
        }

        const junctionStatus = this.getJunctionStatus(x, y);
        if (junctionStatus !== "free") { //Type validation
            if (newPieceType === junctionStatus.type) {
                throw "Junction is already a " + newPieceType;
            }
            if (newPieceType === pieceTypes.CITY) {
                if (junctionStatus.player !== player) {
                    throw "Cant upgrade a settlement that doesnt belong to the player";
                }
                if (junctionStatus.type === pieceTypes.SETTELMENT) {
                    throw "Cant change a city to a settelment";
                }
            }
        }

        if (!this.#isJunction2RoadsApart(x, y)) { //Check if the junction isnt too close to any other junctions
            throw "Junction is to close to another settelment";
        }
        if (!this.#isJunctionConnectedToPlayer(player, x, y)) { //Check if the junction is connected to a road build by the same player
            throw "Junction is not connected to any road build by player " + player;
        }
        return true;
    }

    #isJunction2RoadsApart(x, y) {
        this.tiles.forEach(tile => {
            for (let coord in tile.coordinates) {
                if (Math.round(getDistance(coord.x, coord.y, x, y)) === this.#tileRadius) {
                    return false;
                }
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
        try {
            if (this.#canPlaceRoad(player, startX, startY, endX, endY)) {
                const newRoadObj = {
                    startX: startX,
                    startY: startY,
                    endX: endX,
                    endY: endY,
                    player: player,
                }
                this.roads = [...this.roads, newRoadObj];
                this.#findLongestRoad();
            }
        } catch (error) {
            return { message: "Error: " + error }
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
        //Checks if the road is connected to another player
        if (!this.#isConnectedToJunction(player, startX, startY, endX, endY) || !this.#isConnectedToRoad(player, startX, startY, endX, endY)) {
            throw "Cant place road here"
        }
        return true;
    }

    #isConnectedToJunction(player, startX, startY, endX, endY) {
        const startStatus = this.getJunctionStatus(startX, startY);
        const endStatus = this.getJunctionStatus(endX, endY);
        if (startStatus !== "free" && endStatus !== "free") {
            if (endStatus.player === player || startStatus.player === player) {
                return true;
            }
        }

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
        for (let tile of this.tiles) {
            for (let coord in tile.coordinates) {
                if (coord.x !== x && coord.y !== y) {
                    return false;
                }
            }
        }
        return true;
    }
}

//Each tiles should contain: coordinates, number, resource
function getTilesData(tileRadius) {
    const resources = mixArray(resourcesArr);
    const numbers = mixArray(numbersArr);

    const rowLengths = [3, 4, 5, 4, 3];
    let tileCount = 0;

    const tilesData = [];
    for (let i = 0; i < rowLengths.length; i++) {
        for (let j = 0; j < rowLengths[i]; j++) {
            const tile = new Tile(resources[tileCount], numbers[tileCount], i, j, tileRadius);
            tilesData.push(tile);
            tileCount++;
        }
    }
    return tilesData;
}

module.exports = Board;