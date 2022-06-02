const { eventTypes, directiveTypes } = require("./constants");

// Creates a custom active event object based on the recent played directive
function activeEventObjCreator(directive, game) {
    const eventType = directive.type;
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
    if (eventType === eventTypes.activateDevCard) {
        eventObj = {
            type: eventTypes.activateDevCard,
            card: getCardDirectiveInfo(directive),
            activatingPlayerName: game.playerOrder[0].name,
            activatingPlayerColor: game.playerOrder[0].color,
        }
    }

    return eventObj;
}

// Creates a passive event object based on the next required directives
function passiveEventObjCreator(eventType, game) {
    let eventObj;
    if (eventType === directiveTypes.dropResources) {
        eventObj = {
            type: directiveTypes.dropResources,
            droppingPlayers: game.droppingPlayers,
        }
    }

    return eventObj;
}

function createResourceDropEventObj(game) {
    return eventObj = {
        type: directiveTypes.dropResources,
        droppingPlayers: game.droppingPlayers,
    }
}

function createVictoryEventObj(winnerObj) {
    return {
        type: eventTypes.victory,
        winnerName: winnerObj.playerName,
        winnerColor: winnerObj.playerColor,
        points: winnerObj.points,
    }
}

// Creates a development card event object based on type
function getCardDirectiveInfo(directive) {
    if (directive.card.type === "Monopoly") {
        return {
            type: "Monopoly",
            resource: directive.card.resource,
        }
    }
    if (directive.card.type === "Year of Plenty") {
        return {
            type: "Year of Plenty",
            resourceA: directive.card.resourceA,
            resourceB: directive.card.resourceB,
        }
    }
    if (directive.card.type === "Knight") {
        return {
            type: "Knight",
        }
    }
}

module.exports = {
    activeEventObjCreator, passiveEventObjCreator, createResourceDropEventObj, createVictoryEventObj
}