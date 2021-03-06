import { gameReducerActionTypes } from "../utils/actionTypes";

const initialState = { game: "none" };

export default function gameReducer(state = initialState, action) {
    switch (action.type) {
        case gameReducerActionTypes.setGameData:
            const game = action.data;
            alignBoardCoords(game.game.board);
            return { game: game };
        case gameReducerActionTypes.resetGameData:
            return { game: "none" };
        default:
            return state;
    }
}

function alignBoardCoords(board) {
    const tiles = board.tiles;
    const ports = board.portsData;

    ports.forEach(port => {
        port.junctionA.x += 30;
        port.junctionA.y += 30;
        port.junctionB.x += 30;
        port.junctionB.y += 30;
    })

    board.roads.forEach(road => {
        road.startX += 30;
        road.startY += 30;
        road.endX += 30;
        road.endY += 30;
    })

    board.builtJunctions.forEach(junction => {
        junction.x += 30;
        junction.y += 30;
    })

    tiles.forEach(tile => {
        const { coordinates } = tile;
        coordinates.top.x += 30;
        coordinates.top.y += 30;
        coordinates.topLeft.x += 30;
        coordinates.topLeft.y += 30;
        coordinates.topRight.x += 30;
        coordinates.topRight.y += 30;
        coordinates.bottom.x += 30;
        coordinates.bottom.y += 30;
        coordinates.bottomLeft.x += 30;
        coordinates.bottomLeft.y += 30;
        coordinates.bottomRight.x += 30;
        coordinates.bottomRight.y += 30;
    });
}