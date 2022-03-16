const Game = require("../gameClass/game");
const { randomItemFromArray, mixArray } = require("../utils/helperFunctions");

class catanAPI extends Game {
    constructor(playersDataArr, tileRadius) {
        super(playersDataArr, tileRadius)
        this.playerOrder= mixArray(playersDataArr.slice()); //playerOrder[0] is the current player
    }

    parseDirective(directiveObj) {
        switch (directiveObj.type) {
            case "endTurn":
                this.#advanceTurn();
            case "rollDice":
            //todo
            case "build":
            //todo
            case "activateDevCard":
            //todo
            case "tradeReq":
            //todo
            case "tradeRes":
            //todo
            default:
                //Return Error- bad request
        }
    }

    #advanceTurn(){
        const lastPlayer = this.playerOrder.shift()
        this.playerOrder.push(lastPlayer);
    }
}

module.exports = Turn;