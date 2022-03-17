const Game = require("../gameClass/game");
const { pieceTypes } = require("../utils/constants");
const { randomItemFromArray, mixArray } = require("../utils/helperFunctions");
const { directiveTypes, directiveTypes } = require("./apiConstants");

class catanAPI extends Game {
    constructor(playersDataArr, tileRadius) {
        super(playersDataArr, tileRadius)
        this.playerOrder = mixArray(playersDataArr.slice()); //playerOrder[0] is the current player
        this.directiveExpectation = [directiveTypes.setupBuild];
        this.setupItemsCount = 0;
        this.isSetupPhase = true;
        this.lastRoll = undefined;
    }

    parseDirective(directiveObj) {
        try {
            this.#validateDirective(directiveObj);
            switch (directiveObj.type) {
                case directiveTypes.endTurn:
                    return this.#paseEndTurn(directiveObj);
                case directiveTypes.rollDice:
                    return this.#parseDiceRoll(directiveObj);
                case directiveTypes.build:
                    return this.#parseBuild(directiveObj);
                case directiveTypes.activateDevCard:
                    return this.#parseDevCard(directiveObj);
                case directiveTypes.tradeReq:
                    return this.#parseTradeReq(directiveObj);
                case directiveTypes.tradeRes:
                    return this.#parseTradeRes(directiveObj);
                case directiveTypes.robbPlayer:
                    return this.#parseRobbPlayer(directiveObj);
                case directiveTypes.setupBuild:
                    return this.#parseBuildSetup(directiveObj);
                default:
                //Return Error- bad request
            }
        } catch (error) {
            return { Error: error };
        }
    }

    #parseDiceRoll() {
        try {
            this.lastRoll = this.rollDice();
            this.giveResourcesByRoll(this.lastRoll);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseBuild(directiveObj) {
        try {
            this.#validateSetupBuild(directiveObj);
            const itemToBuild = directiveObj.item.type;
            switch (itemToBuild) {
                case pieceTypes.SETTELMENT:
                    this.buildSettelment(directiveObj.player, itemToBuild.x, itemToBuild.y, true);
                    break;
                case pieceTypes.CITY:
                    this.buildCity(directiveObj.player, itemToBuild.x, itemToBuild.y, true);
                    break;
                case pieceTypes.ROAD:
                    const { startX, startY, endX, endY } = itemToBuild;
                    this.buildRoad(directiveObj.player, startX, startY, endX, endY, true);
                    break;
                case pieceTypes.DEVCARD:
                    this.buildDevCard(directiveObj.player);
                    break;
                default:
                    throw "Invalid build item";
            }
            this.#setDirectiveExpetation(directiveObj.type);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseDevCard(directiveObj) {
        try {

            this.#setDirectiveExpetation(directiveObj.type);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseTradeReq(directiveObj) {
        try {

            this.#setDirectiveExpetation(directiveObj.type);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseTradeRes(directiveObj) {
        try {

            this.#setDirectiveExpetation(directiveObj.type);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseRobbPlayer(directiveObj) {
        try {

            this.#setDirectiveExpetation(directiveObj.type);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseBuildSetup(directiveObj) {
        try {
            this.#validateSetupBuild(directiveObj);
            const itemToBuild = directiveObj.item.type;
            switch (itemToBuild) {
                case pieceTypes.SETTELMENT:
                    const { x, y } = directiveObj.item;
                    this.buildSettelment(directiveObj.player, x, y, false)
                case pieceTypes.ROAD:
                    const { startX, startY, endX, endY } = directiveObj.item;
                    this.buildRoad(directiveObj.player, startX, startY, endX, endY, false);
            }
            this.setupItemsCount++;
            if (this.setupItemsCount === 4 * this.players.length) {
                this.isSetupPhase = false;
            }

            this.#setDirectiveExpetation(directiveObj.type);
        } catch (error) {
            return { Error: error };
        }
    }

    #paseEndTurn() {
        const lastPlayer = this.playerOrder.shift()
        this.playerOrder.push(lastPlayer);

        this.#setDirectiveExpetation(directiveObj.type);
    }

    #validatePlayer(playerColor) {
        if (playerColor !== this.playerOrder[0].color) {
            throw `This is not ${playerColor}'s turn`;
        }
    }

    #validateSetupBuild(directiveObj) {
        if (!this.isSetupPhase) {
            throw "Setup phase is already over";
        }
        const pieceToBuild = directiveObj.item.type;
        const player = directiveObj.player;
        const settelmentsByPlayer = this.getPiecesByPlayer(player, pieceTypes.SETTELMENT);
        const roadsByPlayer = this.getPiecesByPlayer(player, pieceTypes.ROAD);
        if (settelmentsByPlayer === 0 && roadsByPlayer === 0) {
            if (pieceToBuild !== pieceTypes.SETTELMENT) {
                throw "Build a settelment first";
            }
        }
        if (settelmentsByPlayer === 1 && roadsByPlayer === 0) {
            if (pieceToBuild !== pieceTypes.ROAD) {
                throw "Build a road first";
            }
        }
        if (settelmentsByPlayer === 1 && roadsByPlayer === 1) {
            if (pieceToBuild !== pieceTypes.SETTELMENT) {
                throw "Build a second settelment first";
            }
        }
        if (settelmentsByPlayer === 2 && roadsByPlayer === 1) {
            if (pieceToBuild !== pieceTypes.ROAD) {
                throw "Build a second road first";
            }
        }

    }

    #setDirectiveExpetation(lastDirectiveType) {
        this.directiveExpectation = [];
        const { endTurn, robbPlayer, rollDice, build, activateDevCard, tradeReq, tradeRes, setupBuild } = directiveTypes;
        switch (lastDirectiveType) {
            case directiveTypes.endTurn:
                this.directiveExpectation = [rollDice, activateDevCard];
            case directiveTypes.rollDice:
                this.directiveExpectation = [endTurn, build, activateDevCard, tradeReq];
                if (this.lastRoll === 7) {
                    this.directiveExpectation.push(robbPlayer);
                }
            case directiveTypes.build:
                this.directiveExpectation = [endTurn, build, activateDevCard, tradeReq];
            case directiveTypes.activateDevCard:
                this.directiveExpectation = [endTurn, build, tradeReq];
            case directiveTypes.tradeReq:
                this.directiveExpectation = [endTurn, build, activateDevCard, tradeRes];
            case directiveTypes.tradeRes:
                this.directiveExpectation = [endTurn, build, activateDevCard, tradeReq];
            case directiveTypes.robbPlayer:
                this.directiveExpectation = [endTurn, build, activateDevCard, tradeReq];
            case directiveTypes.setupBuild:
                if (this.isSetupPhase) {
                    this.directiveExpectation = [endTurn, setupBuild];
                }
                else {
                    this.directiveExpectation = [endTurn, build, tradeReq, activateDevCard];
                }
        }
    }

    #validateDirective(directiveObj) {
        this.#validatePlayer();
        if (!this.directiveExpectation.includes(directiveObj.type)) {
            throw "Invalid directive. The next directive has to be one of: " + this.directiveExpectation;
        }
    }

    #getGameState() {
        const gameStateObj = {
            board: this.board,
            players: this.players,
        }

        return gameStateObj;
    }

}
module.exports = Turn;