const { resourcesTypes } = require("../utils/constants");

class Tile {
    constructor(resource, number, row, cell, radius) {
        this.number = number;
        this.resource = resource;
        this.row = row;
        this.cell = cell;
        this.coordinates = calulateCoordinatesByBoardPosition(row, cell, radius);
        this.isRobber = resource === resourcesTypes.DESERT ? true : false;
    }
}

module.exports = Tile;

// Calulate the tiles junction's coordinates by its row, cell, and radius
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
