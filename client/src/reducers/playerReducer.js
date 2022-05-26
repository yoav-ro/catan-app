import { playerReducerActionTypes } from "../utils/actionTypes";

const initialState = "";

export default function playerReducer(state = initialState, action) {
    switch (action.type) {
        case playerReducerActionTypes.setCurrPlayer:
            return action.data;
        case playerReducerActionTypes.resetCurrPlayer:
            return "";
        default:
            return state;
    }
}