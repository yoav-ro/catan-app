const { resourcesTypes, numbersArr, resourcesArr, pieceTypes, portsArr } = require("../utils/constants");
const { mixArray, getDistance, roundBySecondDec } = require("../utils/helperFunctions")
const Tile = require("../tileClass/tile");

class Board {
    #tileRadius

    constructor(tileRadius) {
        this.#tileRadius = tileRadius;
        this.roads = [];
        this.longestRoad = [];
        this.tiles = getTilesData(tileRadius);
        this.portsData = getPortsData(this.tiles);
    }

    //Returns the status of the requested junction, if exists.
    getJunctionStatus(x, y) {
        if (this.doCoordinatesExist(x, y)) {
            const tiles = this.getTilesByJunction(x, y);
            const junctionStatus = tiles[0].getJunctionStatus(x, y);
            return junctionStatus;
        }
        else {
            throw "Invalid junction coordinates"
        }
    }

    //Returns the status of the requested road, if exists.
    getRoadStatus(startX, startY, endX, endY) {
        if (this.doCoordinatesExist(startX, startY) && this.doCoordinatesExist(endX, endY)) {
            let status;
            this.roads.forEach(road => {
                if (road.startX === startX && road.startY === startY && road.endX === endX && road.endY === endY) {
                    status = road.player;
                }
            });
            return status ? status : "free";
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
    addJunction(player, x, y, type, shouldBeConnected) {
        if (this.#canPlaceSettelment(player, x, y, shouldBeConnected)) {
            const tilesToAddJunc = this.getTilesByJunction(x, y);
            tilesToAddJunc.forEach(tile => {
                tile.setJunction(x, y, player, type);
            })
            this.#calcLongestRoad();
        }
    }

    //Validates if the settelment can be build
    #canPlaceSettelment(player, x, y, newPieceType, shouldBeConnected) {
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
        if (!this.#isJunctionConnectedToPlayer(player, x, y) && shouldBeConnected) { //Check if the junction is connected to a road build by the same player
            throw "Junction is not connected to any road build by player " + player;
        }
        return true;
    }

    #isJunction2RoadsApart(x, y) {
        this.tiles.forEach(tile => {
            for (let coord in tile.coordinates) {
                if (Math.round(getDistance(tile.coordinates[coord].x, tile.coordinates[coord].y, x, y)) === this.#tileRadius) {
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
        if (this.#canPlaceRoad(player, startX, startY, endX, endY)) {
            const newRoadObj = {
                player: player,
                startX: startX,
                startY: startY,
                endX: endX,
                endY: endY,
            }
            this.roads = [...this.roads, newRoadObj];
            this.#calcLongestRoad();
        }
    }

    #canPlaceRoad(player, startX, startY, endX, endY) {
        //Checks if the coordinates are valid
        if (!this.doCoordinatesExist(startX, startY) || !this.doCoordinatesExist(endX, endY) || Math.round(getDistance(startX, startY, endX, endY)) !== this.#tileRadius) {
            throw "Invalid road";
        }
        //Check if the road is free
        const roadStatus = this.getRoadStatus(startX, startY, endX, endY);
        if (roadStatus !== "free") {
            throw "Road already accupied";
        }
        //Checks if the road is connected to another player
        const isConnectedToJunction = this.#isConnectedToJunction(player, startX, startY, endX, endY);
        const isConnectedToRoad = this.#isConnectedToRoad(player, startX, startY, endX, endY);
        if (!isConnectedToJunction && !isConnectedToRoad) {
            throw "Cant place road here"
        }
        return true;
    }

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

    #calcLongestRoad() {
        this.longestRoad = [];
        this.roads.forEach(road => {
            const longestByMyRoad = this.#getLongestFromSegment([road], []);
            if (longestByMyRoad.length > this.longestRoad.length) {
                this.longestRoad = longestByMyRoad;
            }
        });
    }

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

    getPortsByType(boardType) {
        const portsByType = [];
        this.portsData.forEach(port => {
            if (port.type === boardType) {
                portsByType.push(port);
            }
        })
        return portsByType;
    }

    getTilesByJunction(x, y) {
        const tilesToRet = [];
        this.tiles.forEach(tile => {
            if (tile.doesHaveJunction(x, y)) {
                tilesToRet.push(tile);
            }
        })
        return tilesToRet;
    }

    doCoordinatesExist(x, y) {
        for (let tile of this.tiles) {
            for (let coord in tile.coordinates) {
                if (tile.coordinates[coord].x === x && tile.coordinates[coord].y === y) {
                    return true;
                }
            }
        }

        return false;
    }
}

//Each tiles should contain: coordinates, number, resource
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
    const ports = mixArray(portsArr);
    const portCoords = []; //todo- manage the coords to pairs and give each pair a port type
    tiles.forEach(tile => {
        if (tile.row === 0) {
            if (tile.cell === 0) {
                portCoords.push(
                    {
                        junctionA: tile.coordinates.top,
                        junctionB: tile.coordinates.topLeft,
                        type: ports.pop(),
                    }
                );
            }
            if (tile.cell === 1) {
                portCoords.push({
                    junctionA: tile.coordinates.top,
                    junctionB: tile.coordinates.topRight,
                    type: ports.pop(),
                })
            }
        }
        if (tile.row === 1) {
            if (tile.cell === 0) {
                portCoords.push(
                    {
                        junctionA: tile.coordinates.topLeft,
                        junctionB: tile.coordinates.bottomLeft,
                        type: ports.pop(),
                    }
                );
            }
            if (tile.cell === 3) {
                portCoords.push(
                    {
                        junctionA: tile.coordinates.topRight,
                        junctionB: tile.coordinates.top,
                        type: ports.pop(),
                    }
                );
            }
        }
        if (tile.row === 2) {
            if (tile.cell === 4) {
                portCoords.push(
                    {
                        junctionA: tile.coordinates.topRight,
                        junctionB: tile.coordinates.bottomRight,
                        type: ports.pop(),
                    }
                );
            }
        }
        if (tile.row === 3) {
            if (tile.cell === 0) {
                portCoords.push({
                    junctionA: tile.coordinates.topLeft,
                    junctionB: tile.coordinates.bottomLeft,
                    type: ports.pop(),
                })
            }
            if (tile.cell === 4) {
                portCoords.push({
                    junctionA: tile.coordinates.bottomRight,
                    junctionB: tile.coordinates.bottom,
                    type: ports.pop(),
                })
            }
        }
        if (tile.row === 4) {
            if (tile.cell === 0) {
                portCoords.push({
                    junctionA: tile.coordinates.bottomLeft,
                    junctionB: tile.coordinates.bottom,
                    type: ports.pop(),
                })
            }
            if (tile.cell === 1) {
                portCoords.push({
                    junctionA: tile.coordinates.bottomRight,
                    junctionB: tile.coordinates.bottom,
                    type: ports.pop(),
                })
            }
        }
    })
    return portCoords;
}


module.exports = Board;