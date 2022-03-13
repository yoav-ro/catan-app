const { resourcesTypes } = require("../utils/constants");

class Tile {
    constructor(resource, number, row, cell, radius) {
        this.number = number;
        this.resource = resource;
        this.row = row;
        this.cell = cell;
        this.coordinates = calulateCoordinatesByBoardPosition(row, cell, radius);
        this.isRobber = resource === resourcesTypes.DESERT ? true : false;
        this.surroundingJunctions = [];
    }

    setJunction(x, y, player, type) {
        for (let coord in this.coordinates) {
            if (coord.x === x && coord.y === y) {
                this.#removeJunction(x, y);
                this.surroundingJunctions.push(getJuncObj(x, y, player, type));
            }
        }
    }

    doesHaveJunction(x, y) {
        for (let coord in this.coordinates) {
            if (coord.x === x && coord.y === y) {
                return true;
            }
        }
        return false;
    }

    getJunctionStatus(x, y) {
        for (let i = 0; i < this.surroundingJunctions.length; i++) {
            if (this.surroundingJunctions[i].x === x && this.surroundingJunctions[i].y === y) {
                const { player, type } = this.surroundingJunctions[i];
                return { player, type };
            } else {
                return "free";
            }
        }
    }

    #removeJunction(x, y) {
        for (let i = 0; i < this.surroundingJunctions.length; i++) {
            if (this.surroundingJunctions[i].x === x && this.surroundingJunctions[i].y === y) {
                this.surroundingJunctions.splice(i, 1);
            }
        }
    }
}

module.exports = Tile;

function getJuncObj(x, y, player, type) {
    return {
        x: x,
        y: y,
        player: player,
        type, type
    };
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