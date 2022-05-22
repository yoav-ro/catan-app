export const setGameData = (gameData) => (
    {
        type: "SET_GAME_DATA",
        data: gameData,
        description: "Updates the game's state",
    }
)

export const resetGameData = () => (
    {
        type: "RESET_GAME_DATA",
        description: "Deletes the last game's data",
    }
)

export const setCurrPlayer = (username) => (
    {
        type: "SET_CURR_PLAYER",
        description: "Sets the current player by input",
        data: username,
    }
)

export const resetCurrPlayer = () => (
    {
        type: "RESET_CURR_PLAYER",
        description: "Resets the current player",
    }
)

export const setCanMoveRobber = (canMoveRobber) => (
    {
        type: "SET_AWAIT_MOVE_ROBBER",
        description: "Sets if the game is expectiving a robber move",
        canMoveRobber: canMoveRobber,
    }
)