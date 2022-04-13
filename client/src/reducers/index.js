import { combineReducers } from "redux";
import gameReducer from "./gameReducer";
import playerReducer from "./playerReducer";

export default combineReducers({
    gameReducer, playerReducer
})