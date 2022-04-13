import { combineReducers } from "redux";
import gameReducer from "./gameReducer";
import playerReducer from "./playerReducer";
import modalReducer from "./modalReducer";

export default combineReducers({
    gameReducer, playerReducer, modalReducer
})