const initialState = { game: "none" };

export default function gameReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_GAME_DATA":
            const game = action.data;
            alignBoardCoords(game.game.board);
            return { game: game };
        case "RESET_GAME_DATA":
            return { game: "none" };
        default:
            return state;
    }
}

function alignBoardCoords(board) {
    const tiles = board.tiles;

    tiles.forEach(tile => {
        const { coordinates } = tile;
        coordinates.top.x += 20;
        coordinates.top.y += 20;
        coordinates.topLeft.x += 20;
        coordinates.topLeft.y += 20;
        coordinates.topRight.x += 20;
        coordinates.topRight.y += 20;
        coordinates.bottom.x += 20;
        coordinates.bottom.y += 20;
        coordinates.bottomLeft.x += 20;
        coordinates.bottomLeft.y += 20;
        coordinates.bottomRight.x += 20;
        coordinates.bottomRight.y += 20;
    });
}