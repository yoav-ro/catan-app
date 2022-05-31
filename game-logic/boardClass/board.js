const { resourcesTypes, numbersArr, resourcesArr, pieceTypes, portsArr } = require("../utils/constants");
const { mixArray, getDistance, roundBySecondDec } = require("../utils/helperFunctions")
const Tile = require("../tileClass/Tile");

class Board {
    #tileRadius

    constructor(tileRadius) {
        this.#tileRadius = tileRadius;
        this.roads = [];
        this.builtJunctions = [];
        this.longestRoad = [];
        this.tiles = getTilesData(tileRadius);
        this.portsData = getPortsData(this.tiles);
    }

    // Returns the status of the requested junction, if exists.
    getJunctionStatus(x, y) {
        if (this.doCoordinatesExist(x, y)) {
            const junctionItem = this.builtJunctions.find(junction => this.#compareJunctions(junction.x, junction.y, x, y))
            return junctionItem ? { type: junctionItem.type, player: junctionItem.player } : "free";
        }
        else {
            throw "Invalid junction coordinates";
        }
    }

    // Returns the status of the requested road, if exists.
    getRoadStatus(startX, startY, endX, endY) {
        const roundStartX = roundBySecondDec(startX);
        const roundStartY = roundBySecondDec(startY);
        const roundEndX = roundBySecondDec(endX);
        const roundEndY = roundBySecondDec(endY);

        if (this.doCoordinatesExist(startX, startY) && this.doCoordinatesExist(endX, endY)) {
            let status;
            this.roads.forEach(road => {
                if (roundBySecondDec(road.startX) === roundStartX && roundBySecondDec(road.startY) === roundStartY && roundBySecondDec(road.endX) === roundEndX && roundBySecondDec(road.endY) === roundEndY) {
                    status = road.player;
                }
            });
            return status ? status : "free";
        }
        else {
            throw "Invalid road coordinates";
        }
    }

    moveRobber(row, cell) {
        let retMsg;
        for (let tile of this.tiles) {
            if (tile.row === row && tile.cell === cell) {
                if (tile.isRobber) {
                    throw "Robber already on tile";
                }
                tile.isRobber = true;
                retMsg = `Robber was moved to a ${tile.resource} (${tile.number}) tile`;
            }
        }

        // Remove robber from where it was previously
        for (let tile of this.tiles) {
            if (tile.row !== row && tile.cell !== cell) {
                if (tile.isRobber) {
                    tile.isRobber = false;
                }
            }
        }

        return retMsg;
    }

    // Validates junction input and adds it to the board if valid.
    addJunction(player, x, y, type) {
        const newJunction = {
            type: type,
            x: x,
            y: y,
            player: player,
        }
        if (type === pieceTypes.CITY) {
            for (let i = 0; i < this.builtJunctions.length; i++) {
                if (this.builtJunctions[i].x === x && this.builtJunctions[i].y === y) {
                    this.builtJunctions.splice(i, 1);
                }
            }
        }
        this.builtJunctions.push(newJunction);
        this.#calcLongestRoad();
    }

    // Validates if the settelment can be build
    canPlaceSettelmentOrCity(player, x, y, newPieceType, shouldBeConnected) {
        if (!this.doCoordinatesExist(x, y)) { // Checks if the coordinates are valid
            throw "Invalid junction coordinates";
        }

        const junctionStatus = this.getJunctionStatus(x, y);
        if (junctionStatus !== "free") { // Type validation
            if (newPieceType === junctionStatus.type) {
                throw "Junction is already a " + newPieceType;
            }
            if (newPieceType === pieceTypes.CITY) {
                if (junctionStatus.player !== player.color) {
                    throw "Cant upgrade a settlement that doesnt belong to the player";
                }
            }
        }

        if (!this.#isJunction2RoadsApart(x, y)) { // Check if the junction isnt too close to any other junctions
            throw "Junction is to close to another settelment";
        }
        if (!this.#isJunctionConnectedToPlayer(player.color, x, y) && shouldBeConnected) { // Check if the junction is connected to a road build by the same player
            throw "Junction is not connected to any road build by player " + player.color;
        }
        return true;
    }

    // Validates that the new junction is at least 2 roads apart from all other build junctions
    #isJunction2RoadsApart(x, y) {
        if (this.builtJunctions.length > 0) {
            let ret = true;
            for (let builtJunction of this.builtJunctions) {
                const distanceFromNearest = Math.round(getDistance(builtJunction.x, builtJunction.y, x, y));
                if (distanceFromNearest <= this.#tileRadius && !this.#compareJunctions(builtJunction.x, builtJunction.y, x, y)) {
                    ret = false;
                }
            }
            return ret;
        }
        return true;
    }

    // Validates that the new junction is connected to a road built by the building player
    #isJunctionConnectedToPlayer(player, x, y) {
        for (let road of this.roads) {
            if (roundBySecondDec(road.startX) === roundBySecondDec(x) && roundBySecondDec(road.startY) === roundBySecondDec(y) && road.player === player) {
                return true;
            }
            if (roundBySecondDec(road.endX) === roundBySecondDec(x) && roundBySecondDec(road.endY) === roundBySecondDec(y) && road.player === player) {
                return true;
            }
        }
        return false;
    }

    // Validates road input and adds it to the board if valid.
    addRoad(player, startX, startY, endX, endY) {
        const newRoadObj = {
            player: player,
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
        }
        this.roads.push(newRoadObj);
        this.#calcLongestRoad();
    }

    canPlaceRoad(player, startX, startY, endX, endY) {
        // Checks if the coordinates are valid
        if (!this.doCoordinatesExist(startX, startY) || !this.doCoordinatesExist(endX, endY) || Math.round(getDistance(startX, startY, endX, endY)) !== this.#tileRadius) {
            throw "Invalid road";
        }
        // Check if the road is free
        const roadStatus = this.getRoadStatus(startX, startY, endX, endY);
        if (roadStatus !== "free") {
            throw "Road already accupied";
        }
        // Checks if the road is connected to another player
        const isConnectedToJunction = this.#isConnectedToJunction(player, startX, startY, endX, endY);
        const isConnectedToRoad = this.#isConnectedToRoad(player, startX, startY, endX, endY);
        if (!isConnectedToJunction && !isConnectedToRoad) {
            throw "Cant place road here"
        }
        return true;
    }

    // Checks if the new road is connected to a junction build by the building player
    #isConnectedToJunction(player, startX, startY, endX, endY) {
        const startStatus = this.getJunctionStatus(startX, startY);
        const endStatus = this.getJunctionStatus(endX, endY);

        if (startStatus !== "free" || endStatus !== "free") {
            if (endStatus.player === player || startStatus.player === player) {
                return true;
            }
        }
        return false;
    }

    // Checks if the new road is connected to a road build by the building player
    #isConnectedToRoad(player, startX, startY, endX, endY) {
        const mockRoad = {
            player: player,
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
        }
        let ret = false;
        this.roads.forEach(road => {
            const areConnected = this.#areRoadsConnected(mockRoad, road);
            if (areConnected) {
                ret = true;
            }
        })
        return ret;
    }

    // Find the longest road on the board
    #calcLongestRoad() {
        this.longestRoad = [];
        this.roads.forEach(road => {
            const longestByMyRoad = this.#getLongestFromSegment([road], []); // For every road on board, searches for the longest sequense based on it
            if (longestByMyRoad.length > this.longestRoad.length) {
                this.longestRoad = longestByMyRoad;
            }
        });
    }

    // Enlarges the given roads sequence by adding new connected roads until no new connected roads are found
    #getLongestFromSegment(currSeq, siblingRoads) {
        const nextSegments = this.#checkSegmentNeighbor(currSeq, siblingRoads);
        if (nextSegments.length > 0) {
            for (let i = 0; i < nextSegments.length; i++) {
                const segmentsCopy = nextSegments.slice();
                segmentsCopy.splice(i, 1);
                const nextProcess = [...currSeq, nextSegments[i]];
                return this.#getLongestFromSegment(nextProcess, segmentsCopy);
            }
        }
        return currSeq;
    }

    // Finds all roads diverged from the last road of the given sequence
    #checkSegmentNeighbor(roadSeq, siblingRoads) {
        const lastRoad = roadSeq[roadSeq.length - 1];
        const connectedRoads = [];
        this.roads.forEach(road => {
            if (!roadSeq.includes(road) && !siblingRoads.includes(road)) {
                if (this.#areRoadsConnected(lastRoad, road)) {
                    connectedRoads.push(road);
                }
            }
        })
        return connectedRoads;
    }

    // Checks if the given roads are connected 
    #areRoadsConnected(roadA, roadB) {
        let { player: colorA, startX: startXA, startY: startYA, endX: endXA, endY: endYA } = roadA;
        let { player: colorB, startX: startXB, startY: startYB, endX: endXB, endY: endYB } = roadB;
        if (colorA === colorB) {
            if ((roundBySecondDec(startXA) === roundBySecondDec(startXB) && roundBySecondDec(startYA) === roundBySecondDec(startYB)) && (roundBySecondDec(endXA) !== roundBySecondDec(endXB) || roundBySecondDec(endYA) !== roundBySecondDec(endYB))) {
                if (this.#validateRoadSequence(colorA, startXA, startYA)) {
                    return true;
                }
            }
            if ((roundBySecondDec(startXA) !== roundBySecondDec(startXB) || roundBySecondDec(startYA) !== roundBySecondDec(startYB)) && (roundBySecondDec(endXA) === roundBySecondDec(endXB) && roundBySecondDec(endYA) === roundBySecondDec(endYB))) {
                if (this.#validateRoadSequence(colorA, endXA, endYA)) {
                    return true;
                }
            }
            if ((roundBySecondDec(startXA) === roundBySecondDec(endXB) && roundBySecondDec(startYA) === roundBySecondDec(endYB)) && (roundBySecondDec(endXA) !== roundBySecondDec(startXB) || roundBySecondDec(endYA) !== roundBySecondDec(startYB))) {
                if (this.#validateRoadSequence(colorA, startXA, startYA)) {
                    return true;
                }
            }
            if ((roundBySecondDec(startXA) !== roundBySecondDec(endXB) || roundBySecondDec(startYA) !== roundBySecondDec(endYB)) && (roundBySecondDec(endXA) === roundBySecondDec(startXB) && roundBySecondDec(endYA) === roundBySecondDec(startYB))) {
                if (this.#validateRoadSequence(colorA, endXA, endYA)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Checks if the connection point between two roads isnt blocked by an opponent player's junction
    #validateRoadSequence(player, x, y) {
        const junctionStatus = this.getJunctionStatus(x, y);
        if (junctionStatus === "free") {
            return true;
        }
        if (junctionStatus.player !== player) {
            return false;
        }
        return true;
    }

    // Compares two junctions
    #compareJunctions(j1x, j1y, j2x, j2y) {
        return ((roundBySecondDec(j1x) === roundBySecondDec(j2x)) && (roundBySecondDec(j1y) === roundBySecondDec(j2y)));
    }

    getPortsByType(portType) {
        const portsByType = [];
        this.portsData.forEach(port => {
            if (port.type === portType) {
                portsByType.push(port);
            }
        })
        return portsByType;
    }

    doCoordinatesExist(x, y) {
        for (let tile of this.tiles) {
            for (let coord in tile.coordinates) {
                if (this.#compareJunctions(tile.coordinates[coord].x, tile.coordinates[coord].y, x, y)) {
                    return true;
                }
            }
        }
        return false;
    }
}

// Each tiles should contain: coordinates, number, resource
function getTilesData(tileRadius) {
    const resources = mixArray(resourcesArr);
    const numbers = mixArray(numbersArr);

    const rowLengths = [3, 4, 5, 4, 3];
    let tileCount = 0;

    const tilesData = [];
    let savedNum;

    for (let i = 0; i < rowLengths.length; i++) {
        for (let j = 0; j < rowLengths[i]; j++) {
            let tile;
            if (resources[tileCount] === resourcesTypes.DESERT) {
                tile = new Tile(resources[tileCount], undefined, i, j, tileRadius);
                savedNum = numbers[tileCount];
            }
            else {
                if (!numbers[tileCount]) {
                    tile = new Tile(resources[tileCount], savedNum, i, j, tileRadius);
                }
                else {
                    tile = new Tile(resources[tileCount], numbers[tileCount], i, j, tileRadius);
                }
            }

            tilesData.push(tile);
            tileCount++;
        }
    }
    return tilesData;
}

function getPortsData(tiles) {
    const ports = portsArr.slice();
    const portCoords = [];
    tiles.forEach(tile => {
        //     if (tile.row === 0) {
        //         if (tile.cell === 0) {
        //             portCoords.push(
        //                 {
        //                     junctionA: tile.coordinates.bottom,
        //                     junctionB: tile.coordinates.bottomLeft,
        //                     type: ports.pop(),
        //                 }
        //             );
        //         }
        //         if (tile.cell === 1) {
        //             portCoords.push({
        //                 junctionA: tile.coordinates.bottom,
        //                 junctionB: tile.coordinates.bottomRight,
        //                 type: ports.pop(),
        //             })
        //         }
        //     }
        //     if (tile.row === 1) {
        //         if (tile.cell === 0) {
        //             portCoords.push(
        //                 {
        //                     junctionA: tile.coordinates.topLeft,
        //                     junctionB: tile.coordinates.bottomLeft,
        //                     type: ports.pop(),
        //                 }
        //             );
        //         }
        //         if (tile.cell === 3) {
        //             portCoords.push(
        //                 {
        //                     junctionA: tile.coordinates.bottomRight,
        //                     junctionB: tile.coordinates.bottom,
        //                     type: ports.pop(),
        //                 }
        //             );
        //         }
        //     }
        //     if (tile.row === 2) {
        //         if (tile.cell === 4) {
        //             portCoords.push(
        //                 {
        //                     junctionA: tile.coordinates.topRight,
        //                     junctionB: tile.coordinates.bottomRight,
        //                     type: ports.pop(),
        //                 }
        //             );
        //         }
        //     }
        //     if (tile.row === 3) {
        //         if (tile.cell === 0) {
        //             portCoords.push({
        //                 junctionA: tile.coordinates.topLeft,
        //                 junctionB: tile.coordinates.bottomLeft,
        //                 type: ports.pop(),
        //             })
        //         }
        //         if (tile.cell === 3) {
        //             portCoords.push({
        //                 junctionA: tile.coordinates.topRight,
        //                 junctionB: tile.coordinates.top,
        //                 type: ports.pop(),
        //             })
        //         }
        //     }
        //     if (tile.row === 4) {
        //         if (tile.cell === 0) {
        //             portCoords.push({
        //                 junctionA: tile.coordinates.topLeft,
        //                 junctionB: tile.coordinates.top,
        //                 type: ports.pop(),
        //             })
        //         }
        //         if (tile.cell === 1) {
        //             portCoords.push({
        //                 junctionA: tile.coordinates.topRight,
        //                 junctionB: tile.coordinates.top,
        //                 type: ports.pop(),
        //             })
        //         }
        //     }
        // })
        if (tile.row === 0) {
            if (tile.cell === 0) {
                const portObj = {
                    junctionA: tile.coordinates.bottom,
                    junctionB: tile.coordinates.bottomLeft,
                    type: ports[0],
                }
                portCoords.push(portObj);
            }
            if (tile.cell === 1) {
                const portObj = {
                    junctionA: tile.coordinates.bottom,
                    junctionB: tile.coordinates.bottomRight,
                    type: ports[1],
                }
                portCoords.push(portObj);
            }
        }
        if (tile.row === 1) {
            if (tile.cell === 0) {
                const portObj = {
                    junctionA: tile.coordinates.bottom,
                    junctionB: tile.coordinates.topLeft,
                    type: ports[8],
                }
                portCoords.push(portObj);
            }
            if (tile.cell === 3) {
                const portObj = {
                    junctionA: tile.coordinates.bottom,
                    junctionB: tile.coordinates.bottomRight,
                    type: ports[2],
                }
                portCoords.push(portObj);
            }
        }
        if (tile.row === 2) {
            if (tile.cell === 4) {
                const portObj = {
                    junctionA: tile.coordinates.bottomRight,
                    junctionB: tile.coordinates.topRight,
                    type: ports[3],
                }
                portCoords.push(portObj);
            }
        }
        if (tile.row === 3) {
            if (tile.cell === 0) {
                const portObj = {
                    junctionA: tile.coordinates.bottomLeft,
                    junctionB: tile.coordinates.topLeft,
                    type: ports[7],
                }
                portCoords.push(portObj)
            }
            if (tile.cell === 3) {
                const portObj = {
                    junctionA: tile.coordinates.topRight,
                    junctionB: tile.coordinates.top,
                    type: ports[4],
                }
                portCoords.push(portObj);
            }
        }
        if (tile.row === 4) {
            if (tile.cell === 0) {
                const portObj = {
                    junctionA: tile.coordinates.top,
                    junctionB: tile.coordinates.bottomLeft,
                    type: ports[6],
                }
                portCoords.push(portObj);
            }
            if (tile.cell === 1) {
                const portObj = {
                    junctionA: tile.coordinates.top,
                    junctionB: tile.coordinates.topRight,
                    type: ports[5],
                }
                portCoords.push(portObj);
            }
        }
    })
    return portCoords;
}

module.exports = Board;