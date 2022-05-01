const eventTypes = {
    rollDice: "rollDice",
    victory: "victory",
    gameOver: "gameOver",
    activateDevCard: "activateDevCard",
}

const directiveTypes = {
    endTurn: "endTurn",
    rollDice: "rollDice",
    build: "build",
    activateDevCard: "activateDevCard",
    tradeReq: "tradeReq",
    tradeRes: "tradeRes",
    robbPlayer: "robbPlayer",
    setupBuild: "setupBuild",
    tradeWithPort: "tradeWithPort",
}

const eventDirectivesArr=[
    directiveTypes.rollDice,
    directiveTypes.activateDevCard,
]

module.exports={
    eventTypes, directiveTypes, eventDirectivesArr
}