const eventTypes = {
    rollDice: "rollDice",
    victory: "victory",
    gameOver: "gameOver",
    activateDevCard: "activateDevCard",
    rolledSeven: "rolledSeven",
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
    dropResources: "dropResources",
}

const activeEventDirectivesArr=[
    directiveTypes.rollDice,
    directiveTypes.activateDevCard,
]

const passiveEventDirectivesArr=[
    directiveTypes.dropResources
]

module.exports={
    eventTypes, directiveTypes, activeEventDirectivesArr, passiveEventDirectivesArr
}