const Game = require("../gameClass/game");
const { pieceTypes } = require("../utils/constants");
const { randomItemFromArray, mixArray } = require("../utils/helperFunctions");
const { directiveTypes } = require("./apiConstants");

class catanAPI extends Game {
    constructor(playersDataArr, tileRadius) {
        super(playersDataArr, tileRadius)
        this.playerOrder = mixArray(playersDataArr.slice()); //playerOrder[0] is the current player
        this.directiveExpectation = [];
        this.setupItemsCount = 0;
        this.isSetupPhase = true;
    }

    parseDirective(directiveObj) {
        switch (directiveObj.type) {
            case directiveTypes.endTurn:
                return this.#advanceTurn();
            case directiveTypes.rollDice:
                return this.#parseDiceRoll();
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
    }

    #parseDiceRoll() {
        try {
            this.#validatePlayer();
            this.rollDice();
        } catch (error) {
            return { Error: error };
        }
    }

    #parseBuild(directiveObj) {
        try {
            this.#validatePlayer();
            this.#validateSetupBuild(directiveObj);
            const itemToBuild = directiveObj.item.type;
            switch (itemToBuild) {
                case pieceTypes.SETTELMENT:
                    const { x, y } = directiveObj.item;
                    let shouldTakeResources = false;
                    if (this.isSetupPhase) {
                        shouldTakeResources = true;
                    }
                    this.buildSettelment(directiveObj.player, x, y, shouldTakeResources)
                    break;

                default:
                    break;
            }
        } catch (error) {
            return { Error: error };
        }
    }

    #parseDevCard(directiveObj) {
        try {
            this.#validatePlayer(directiveObj.player);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseTradeReq(directiveObj) {
        try {
            this.#validatePlayer(directiveObj.player);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseTradeRes(directiveObj) {
        try {
            this.#validatePlayer(directiveObj.player);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseRobbPlayer(directiveObj) {
        try {
            this.#validatePlayer(directiveObj.player);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseBuildSetup(directiveObj) {
        try {
            this.#validatePlayer();
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
        } catch (error) {
            return { Error: error };
        }
    }

    #advanceTurn() {
        const lastPlayer = this.playerOrder.shift()
        this.playerOrder.push(lastPlayer);
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

    #getGameState() {
        const gameStateObj = {
            board: this.board,
            players: this.players,
        }

        return gameStateObj;
    }

}

module.exports = Turn;