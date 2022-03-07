import { resourcesTypes, numbersArr, resourcesArr } from "./utils/constants";
import { mixArray } from "./utils/helperFunctions"

class Board {
    constructor(tileRadius) {
        this.roads = [];
        this.settelments = [];
        this.tiles = getTilesData(tileRadius);
    }

}

//Each tiles should contain: coordinates, status, number, resource
function getTilesData(tileRadius) {
    const resources = mixArray(resourcesArr);
    const numbers = mixArray(numbersArr);

    tilesData = resources.map(tile => {

        if (tile.name === resourcesTypes.DESERT.name) {
            return { resource: tile, number: undefined };
        } else {
            return { resource: tile, number: numbers.pop() }
        }
    });
}

function calulateCoordinatesByBoardPosition(row, cell, radius) {
    const rad30 = 30 * Math.PI / 180;

    const center = {
        x: cell * radius * 2 + radius + row % 2 * radius,
        y: (row * (Math.tan(rad30) + 1) + 1) * radius,
    }
    if (row === 0 || row === 4) {
        center.x += radius * 2;
    }

    const coordinates = {
        top: { x: center.x, y: center.y + radius },
        topLeft: { x: center.x - radius, y: center.y + Math.tan(rad30) * radius },
        topRight: { x: center.x + radius, y: center.y + Math.tan(rad30) * radius },
        bottom: { x: center.x, y: center.y - radius },
        bottomLeft: { x: center.x - radius, y: center.y - Math.tan(rad30) * radius },
        bottomRight: { x: center.x + radius, y: center.y - Math.tan(rad30) * radius },
    }

    return coordinates;
}