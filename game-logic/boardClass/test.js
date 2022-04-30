const tile = {
    coordinates: {
        top: { x: 181.86533479473212, y: 140 },
        topLeft: { x: 121.2435565298214, y: 105 },
        topRight: { x: 242.48711305964284, y: 105 },
        bottom: { x: 181.86533479473212, y: 0 },
        bottomLeft: { x: 121.2435565298214, y: 35 },
        bottomRight: { x: 242.48711305964284, y: 35 }
    }
}

const directive = {
    type: 'build',
    player: 'orange',
    item: {
        type: 'road',
        startX: 242.48711305964287,
        startY: 35,
        endX: 181.86533479473212,
        endY: 0
    }
}

function roundBySecondDec(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

function doCoordinatesExist(x, y) {
    for (let coord in tile.coordinates) {
        if (roundBySecondDec(tile.coordinates[coord].x) === roundBySecondDec(x) && roundBySecondDec(tile.coordinates[coord].y) === roundBySecondDec(y)) {
            return true;
        }
    }

    return false;
}

console.log(doCoordinatesExist(directive.item.startX, directive.item.startY));
console.log(doCoordinatesExist(directive.item.endX, directive.item.endY)); 