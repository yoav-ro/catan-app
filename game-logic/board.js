const { resourcesTypes, numbersArr, resourcesArr, players } = require("./utils/constants");
const { mixArray, getDistance } = require("./utils/helperFunctions")

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
        try {
            if (this.doCoordinatesExist(x, y)) {
                this.junctions.forEach(junction => {
                    if (junction.x === x && junction.y === y) {
                        return junction.status;
                    }
                });
                return "free";
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

    //Validates junction input and adds it to the board if valid.
    addJunction(player, x, y) {
        try {
            if (this.#canPlaceSettelment(player, x, y)) {
                const newJunctionObj = {
                    x: x,
                    y: y,
                    player: player,
                }
                this.junctions = [...this.junctions, newJunctionObj];
            }
        } catch (error) {
            return { message: "Error: " + error }
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
        try {
            if (!this.doCoordinatesExist(startX, startY) || !this.doCoordinatesExist(endX, endY) || Math.round(getDistance(startX, startY, endX, endY)) !== this.#tileRadius) {
                throw "Invalid road";
            }
            if (this.getRoadStatus(startX, startY, endX, endY) === "free") {
                const newRoadObj = {
                    startX: startX,
                    startY: startY,
                    endX: endX,
                    endY: endY,
                    status: player
                }
                this.roads = [...this.roads, newRoadObj];
                this.updateLongestRoad(newRoadObj);
            }
            else {
                throw "Road already accupied";
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
            if (road.startX === startX && road.startY === startY && road.status === player) {
                return true;
            }
            if (road.endX === endX && road.endY === endY && road.status === player) {
                return true;
            }
            if (road.endX === startX && road.endY === startY && road.status === player) {
                return true;
            }
        })
        return false;
    }

    doCoordinatesExist(x, y) {
        let retValue = true;
        for (let tile of this.tiles) {
            for (let coord in this.tiles.coordinates) {
                if (coord.x !== x && coord.y !== y) {
                    retValue = false;
                }
            }
        }
        return retValue;
    }

    // get roads() {
    //     return this.roads;
    // }

    // get settelments() {
    //     return this.settelments;
    // }

    // get tiles() {
    //     return this.tiles;
    // }

    // get getLongestRoad() {
    //     return this.longestRoad
    // }
}

//Each tiles should contain: coordinates, number, resource
function getTilesData(tileRadius) {
    const resources = mixArray(resourcesArr);
    const numbers = mixArray(numbersArr);

    const tilesData = resources.map(tile => {
        if (tile.name === resourcesTypes.DESERT.name) {
            return { resource: tile, number: undefined };
        } else {
            return { resource: tile, number: numbers.pop() }
        }
    });
    const rowLengths = [3, 4, 5, 4, 3];

    for (let i = 0; i < rowLengths.length; i++) {
        for (let j = 0; j < rowLengths[i]; j++) {
            tilesData.coordinates = calulateCoordinatesByBoardPosition(i, j, tileRadius);
        }
    }

    return tilesData;
}

function calulateCoordinatesByBoardPosition(row, cell, radius) {
    const rad30 = 30 * Math.PI / 180;
    const hexPerpendicular = Math.cos(rad30) * radius;

    const center = {
        x: cell * hexPerpendicular * 2 + hexPerpendicular + row % 2 * hexPerpendicular,
        y: radius * 1.5 * row + radius,
    }
    if (row === 0 || row === 4) {
        center.x += hexPerpendicular * 2;
    }

    const coordinates = {
        top: { x: center.x, y: center.y + radius },
        topLeft: { x: center.x - hexPerpendicular, y: center.y + Math.tan(rad30) * hexPerpendicular },
        topRight: { x: center.x + hexPerpendicular, y: center.y + Math.tan(rad30) * hexPerpendicular },
        bottom: { x: center.x, y: center.y - radius },
        bottomLeft: { x: center.x - hexPerpendicular, y: center.y - Math.tan(rad30) * hexPerpendicular },
        bottomRight: { x: center.x + hexPerpendicular, y: center.y - Math.tan(rad30) * hexPerpendicular },
    }

    return coordinates;
}