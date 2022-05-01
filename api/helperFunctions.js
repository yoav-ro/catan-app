const { eventTypes } = require("./constants");


function eventObjCreator(eventType, game) {
    let eventObj;
    if (eventType === eventTypes.rollDice) {
        eventObj = {
            type: eventTypes.rollDice,
            dice1: game.lastRoll.dice1,
            dice2: game.lastRoll.dice2,
            rollerName: game.playerOrder[0].name,
            rollerColor: game.playerOrder[0].color,
        }
    }

    return eventObj;
}

module.exports = {
    eventObjCreator,
}