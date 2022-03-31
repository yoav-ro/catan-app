export default function gameReducer(state, action) {
    switch (key) {
        case "SET_GAME_DATA":
            const game = action.data;
            return { game: game };
        case "RESET_GAME_DATA":
            return { game: "none" };
        default:
            return state;
    }
}