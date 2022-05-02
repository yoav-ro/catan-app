export function buildSettelmentDir(x, y, player) {
    return {
        type: "build",
        player: player,
        item: {
            type: "settelment",
            x: x,
            y: y,
        }
    }
}

export function setupBuildSettelmetDir(x, y, player) {
    return {
        type: "setupBuild",
        player: player,
        item: {
            type: "settelment",
            x: x,
            y: y,
        }
    }
}

export function buildCityDir(x, y, player) {
    return {
        type: "build",
        player: player,
        item: {
            type: "city",
            x: x,
            y: y,
        }
    }
}

export function buildRoadDir(x1, y1, x2, y2, player) {
    return {
        type: "build",
        player: player,
        item: {
            type: "road",
            startX: x1,
            startY: y1,
            endX: x2,
            endY: y2,
        }
    }
}

export function setupBuildRoadDir(x1, y1, x2, y2, player) {
    return {
        type: "setupBuild",
        player: player,
        item: {
            type: "road",
            startX: x1,
            startY: y1,
            endX: x2,
            endY: y2,
        }
    }
}

export function endTurnDir(player) {
    return {
        type: "endTurn",
        player: player,
    }
}

export function rollDiceDir(player) {
    return {
        type: "rollDice",
        player: player,
    }
}