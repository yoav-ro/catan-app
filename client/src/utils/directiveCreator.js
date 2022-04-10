export function BuildSettelment(x, y, player) {
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