const initialState = { game: "none" };

export default function gameReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_GAME_DATA":
            const game = action.data;
            return { game: game };
        case "RESET_GAME_DATA":
            return { game: "none" };
        default:
            return state;
    }
}