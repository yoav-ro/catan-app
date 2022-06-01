import { chatReducerActionTypes } from "../utils/actionTypes";

const initialState = [];

export default function playerReducer(state = initialState, action) {
    switch (action.type) {
        case chatReducerActionTypes.newMsg:
            return [state, ...action.data];
        case chatReducerActionTypes.resetChat:
            return initialState;
        default:
            return state;
    }
}