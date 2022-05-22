import { robberReducerGameTypes } from "../utils/actionTypes";

const initialState = false;

export default function robberReducer(state = initialState, action) {
    switch (action.type) {
        case robberReducerGameTypes.canMoveRobber:
            return action.canMoveRobber;
        default:
            return state;
    }
}