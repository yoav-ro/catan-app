const { resourcesTypes } = require("../utils/constants");
const { roundBySecondDec } = require("../utils/helperFunctions");

class Tile {
    constructor(resource, number, row, cell, radius) {
        this.number = number;
        this.resource = resource;
        this.row = row;
        this.cell = cell;
        this.coordinates = calulateCoordinatesByBoardPosition(row, cell, radius);
        this.isRobber = resource === resourcesTypes.DESERT ? true : false;
        // this.surroundingJunctions = [];
    }

    // setJunction(x, y, player, type) {
    //     for (let coord in this.coordinates) {
    //         if (roundBySecondDec(this.coordinates[coord].x) === roundBySecondDec(x) && roundBySecondDec(this.coordinates[coord].y) === roundBySecondDec(y)) {
    //             this.#removeJunction(x, y);
    //             const newJuncObj = getJuncObj(x, y, player, type);
    //             this.surroundingJunctions = [...this.surroundingJunctions, newJuncObj];
    //         }
    //     }
    // }

    // doesHaveJunction(x, y) {
    //     const roundX = roundBySecondDec(x);
    //     const roundY = roundBySecondDec(y);
    //     for (let coord in this.coordinates) {
    //         if (roundBySecondDec(this.coordinates[coord].x) === roundX && roundBySecondDec(this.coordinates[coord].y) === roundY) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // getJunctionStatus(x, y) {
    //     for (let i = 0; i < this.surroundingJunctions.length; i++) {
    //         if (roundBySecondDec(this.surroundingJunctions[i].x) === roundBySecondDec(x) && roundBySecondDec(this.surroundingJunctions[i].y) === roundBySecondDec(y)) {
    //             const { player, type } = this.surroundingJunctions[i];
    //             return { player: player, type: type };
    //         }
    //     }
    //     return "free";
    // }

    // #removeJunction(x, y) {
    //     for (let i = 0; i < this.surroundingJunctions.length; i++) {
    //         if (roundBySecondDec(this.surroundingJunctions[i].x) === roundBySecondDec(x) && roundBySecondDec(this.surroundingJunctions[i].y) === roundBySecondDec(y)) {
    //             this.surroundingJunctions.splice(i, 1);
    //         }
    //     }
    // }
}

module.exports = Tile;

// function getJuncObj(x, y, player, type, port) {
//     return {
//         x: x,
//         y: y,
//         player: player,
//         type: type,
//         port: port,
//     };
// }

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
