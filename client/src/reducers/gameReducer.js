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
        coordinates.top.x += 10;
        coordinates.top.y += 10;
        coordinates.topLeft.x += 10;
        coordinates.topLeft.y += 10;
        coordinates.topRight.x += 10;
        coordinates.topRight.y += 10;
        coordinates.bottom.x += 10;
        coordinates.bottom.y += 10;
        coordinates.bottomLeft.x += 10;
        coordinates.bottomLeft.y += 10;
        coordinates.bottomRight.x += 10;
        coordinates.bottomRight.y += 10;
    });
}