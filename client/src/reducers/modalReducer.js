const initialState = "";

export default function modalReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_CURR_MODAL":
            return action.data;
        default:
            return state;
    }
}