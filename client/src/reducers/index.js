import { combineReducers } from "redux";
import gameReducer from "./gameReducer";
import playerReducer from "./playerReducer";
import robberReducer from "./robberReducer";
import chatReducer from "./chatReducer";

export default combineReducers({
    gameReducer, playerReducer, robberReducer, chatReducer
})