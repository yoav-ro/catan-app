import { chatReducerActionTypes, gameReducerActionTypes, playerReducerActionTypes, robberReducerGameTypes } from "./utils/actionTypes"

export const setGameData = (gameData) => (
    {
        type: gameReducerActionTypes.setGameData,
        data: gameData,
        description: "Updates the game's state",
    }
)

export const resetGameData = () => (
    {
        type: gameReducerActionTypes.resetGameData,
        description: "Deletes the last game's data",
    }
)

export const setCurrPlayer = (username) => (
    {
        type: playerReducerActionTypes.setCurrPlayer,
        description: "Sets the current player by input",
        data: username,
    }
)

export const resetCurrPlayer = () => (
    {
        type: playerReducerActionTypes.resetCurrPlayer,
        description: "Resets the current player",
    }
)

export const setCanMoveRobber = (canMoveRobber) => (
    {
        type: robberReducerGameTypes.canMoveRobber,
        description: "Sets if the game is expectiving a robber move",
        canMoveRobber: canMoveRobber,
    }
)

export const newChatMsg = (msgObj) => (
    {
        type: chatReducerActionTypes.newMsg,
        description: "Adds a new message to the game chat",
        data: msgObj,
    }
)

export const resetChat = () => (
    {
        type: chatReducerActionTypes.resetChat,
        description: "Resets the chat",
    }
)