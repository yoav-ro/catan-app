const initialState = "";

export default function playerReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_CURR_PLAYER":
            return action.data;
        case "RESET_CURR_PLAYER":
            return "";
        default:
            return state;
    }
}