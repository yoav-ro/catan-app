export function buildSettelmentDir(x, y, player) {
    return {
        type: "build",
        player: player,
        item: {
            name: "settelment",
            x: x,
            y: y,
        }
    }
}

export function endTurnDir(player){
    return {
        type: "endTurn",
        player: player,
    }
}

export function rollDiceDir(player){
    return {
        type: "rollDice",
        player: player,
    }
}