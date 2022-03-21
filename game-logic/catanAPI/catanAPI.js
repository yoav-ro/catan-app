const Game = require("../gameClass/game");
const { pieceTypes, devCards } = require("../utils/constants");
const { randomItemFromArray, mixArray } = require("../utils/helperFunctions");
const { directiveTypes, directiveTypes } = require("./apiConstants");

//todo:
//set return messages
//also return updated game data on every request
//longest road 
//largest army - good
//ports
//bank trade

class catanAPI extends Game {
    constructor(playersDataArr, tileRadius) {
        super(playersDataArr, tileRadius)
        this.playerOrder = mixArray(playersDataArr.slice()); //playerOrder[0] is the current player
        this.setupOrder = mixArray(playersDataArr.slice())
        this.directiveExpectation = [directiveTypes.setupBuild];
        this.setupItemsCount = 0;
        this.isSetupPhase = true;
        this.isAwaitingRobb = false;
        this.lastRoll = undefined;
        this.pendingTrade = undefined;
    }

    parseDirective(directiveObj) {
        try {
            this.#validateDirective(directiveObj);
            switch (directiveObj.type) {
                case directiveTypes.endTurn:
                    return this.#parseEndTurn(directiveObj); //good
                case directiveTypes.rollDice:
                    return this.#parseDiceRoll(directiveObj); //good
                case directiveTypes.build:
                    return this.#parseBuild(directiveObj); //good
                case directiveTypes.activateDevCard:
                    return this.#parseDevCard(directiveObj); //good
                case directiveTypes.tradeReq:
                    return this.#parseTradeReq(directiveObj); //good
                case directiveTypes.tradeRes:
                    return this.#parseTradeRes(directiveObj); //good
                case directiveTypes.robbPlayer:
                    return this.#parseRobbPlayer(directiveObj); //good
                case directiveTypes.setupBuild:
                    return this.#parseBuildSetup(directiveObj); //good
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
            this.#setDirectiveExpetation(directiveTypes.rollDice);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseBuild(directiveObj) {
        try {
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
            this.#setDirectiveExpetation(directiveTypes.build);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseDevCard(directiveObj) {
        const { player, card } = directiveObj;

        try {
            switch (card.type) {
                case devCards.knight.name:
                    const { newRobberX, newRobberY } = card;
                    this.activateKnight(player, newRobberX, newRobberY);
                    this.isAwaitingRobb = true;
                    break;
                case devCards.monopoly.name:
                    this.activateMonopoly(player, card.resource);
                    break;
                case devCards.roadBuilding.name:
                    const { firstRoadStartX, firstRoadStartY, firstRoadEndX, firstRoadEndY, secondRoadStartX, secondRoadStartY, secondRoadEndX, secondRoadEndY } = card;
                    this.activateRoadBuilding(player, firstRoadStartX, firstRoadStartY, firstRoadEndX, firstRoadEndY, secondRoadStartX, secondRoadStartY, secondRoadEndX, secondRoadEndY);
                    break;
                case devCards.yearOfPlenty.name:
                    const { resourceA, resourceB } = card;
                    this.activateYearOfPlenty(player, resourceA, resourceB);
                default:
                    throw "Invalid dev card type";
            }
            this.#setDirectiveExpetation(directiveObj.type);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseTradeReq(directiveObj) {
        try {
            const { player, tradeWith, givenResources, recievedResources } = directiveObj;
            this.#validateTradeReq(player, tradeWith, givenResources, recievedResources);
            this.#setPendingTrade(player, tradeWith, givenResources, recievedResources);
            this.#setDirectiveExpetation(directiveObj.type);
        } catch (error) {
            return { Error: error };
        }
    }

    #validateTradeReq(player, tradeWith, givenResources, recievedResources) {
        if (!player || !tradeWith || !givenResources || !recievedResources) {
            throw "Invalid trade request";
        }
        if (givenResources === [] || recievedResources === []) {
            throw '"Free" resource giving isnt allowed'
        }
        if (player === tradeWith) {
            throw "A player cannot trade with himself";
        }
    }

    #parseTradeRes(directiveObj) {
        try {
            if (!this.pendingTrade) {
                throw "No pending trade detected";
            }
            if (directiveObj.isAccepted) {
                const { offeringPlayer, offeringPlayerResources, offeredPlayer, offeredPlayerResources } = this.pendingTrade;
                this.executeTrade(offeringPlayer, offeredPlayer, offeringPlayerResources, offeredPlayerResources);
            }
            this.#setDirectiveExpetation(directiveObj.type);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseRobbPlayer(directiveObj) {
        try {
            const { player, playerToRob } = directiveObj;
            this.robbPlayer(player, playerToRob);
            this.isAwaitingRobb = false;
            this.#setDirectiveExpetation(directiveTypes.robbPlayer);
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
                    break;
                case pieceTypes.ROAD:
                    const { startX, startY, endX, endY } = directiveObj.item;
                    this.buildRoad(directiveObj.player, startX, startY, endX, endY, false);
                    break;
            }
            this.setupItemsCount++;
            if (this.setupItemsCount === 4 * this.players.length) {
                this.isSetupPhase = false;
            }

            this.#setDirectiveExpetation(directiveTypes.setupBuild);
        } catch (error) {
            return { Error: error };
        }
    }

    #parseEndTurn() {
        try {
            if (this.isSetupPhase) {
                const lastPlayer = this.setupOrder.shift()
                this.setupOrder.push(lastPlayer);
                if (this.setupItemsCount === 8) {
                    this.setupOrder.reverse();
                }
            }
            else {
                const lastPlayer = this.playerOrder.shift()
                this.playerOrder.push(lastPlayer);
                this.isAwaitingRobb = false;
            }
            this.#setDirectiveExpetation(directiveObj.type);
        } catch (error) {
            return { Error: error };
        }
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
                    this.isAwaitingRobb = true;
                }
            case directiveTypes.build:
                this.directiveExpectation = [endTurn, build, activateDevCard, tradeReq];
            case directiveTypes.activateDevCard:
                this.directiveExpectation = [endTurn, build, tradeReq];
                if(this.isAwaitingRobb){
                    this.directiveExpectation.push(robbPlayer);
                }
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

    #setPendingTrade(playerA, playerB, resPlayerA, resPlayerB) {
        const pendingTradeObj = {
            offeringPlayer: playerA,
            offeringPlayerResources: resPlayerA,
            offeredPlayer: playerB,
            offeredPlayerResources: resPlayerB,
        }

        this.pendingTrade = pendingTradeObj;
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