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