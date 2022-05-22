const initialState = false;

export default function robberReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_AWAIT_MOVE_ROBBER":
            return action.canMoveRobber;
        default:
            return state;
    }
}