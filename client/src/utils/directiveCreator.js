import { directiveTypes } from "./constants"

export function buildSettelmentDir(x, y, player) {
    return {
        type: directiveTypes.build,
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
        type: directiveTypes.setupBuild,
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
        type: directiveTypes.build,
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
        type: directiveTypes.build,
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
        type: directiveTypes.setupBuild,
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
        type: directiveTypes.endTurn,
        player: player,
    }
}

export function rollDiceDir(player) {
    return {
        type: directiveTypes.rollDice,
        player: player,
    }
}

export function buyDevCardDir(player) {
    return {
        type: directiveTypes.buyDevCard,
        player: player,
    }
}

export function activateMonopolyDir(player, resource) {
    return {
        type: directiveTypes.activateDevCard,
        player: player,
        card: {
            type: "Monopoly",
            resource: resource,
        }
    }
}

export function activateYoPDir(player, resourceA, resourceB) {
    return {
        type: directiveTypes.activateDevCard,
        player: player,
        card: {
            type: "Year of Plenty",
            resourceA: resourceA,
            resourceB: resourceB,
        }
    }
}

export function dropResourcesDir(player, resourcesToDrop) {
    return {
        type: directiveTypes.dropResources,
        player: player,
        resources: resourcesToDrop,
    }
}

export function moveRobberDir(player, newRow, newCell) {
    return {
        type: directiveTypes.moveRobber,
        player: player,
        newRow: newRow,
        newCell: newCell,
    }
}

export function robbPlayerDir(robbingPlayer, robbedPlayer) {
    return {
        type: directiveTypes.robbPlayer,
        player: robbingPlayer,
        playerToRob: robbedPlayer,
    }
}