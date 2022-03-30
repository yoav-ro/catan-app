const Game = require("../gameClass/game");
const { pieceTypes, devCards } = require("../utils/constants");
const { randomItemFromArray, mixArray } = require("../utils/helperFunctions");
const { directiveTypes, directiveTypes } = require("./apiConstants");

//todo:
//set return messages - good
//also return updated game data on every request - good
//longest road 
//largest army - good
//ports - good
//bank trade - good
// handle victory

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

    sendDirective(directiveObj) {
        const directiveMsg = this.#parseDirective(directiveObj);
        const gameData = this.#getGameState();
        return {
            gameData: gameData,
            message: directiveMsg,
            exectation: this.directiveExpectation,
        }
    }

    #parseDirective(directiveObj) {
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
                case directiveTypes.tradeWithPort:
                    return this.#parseTradeWithPort(directiveObj); //good
                default:
                    return { Error: "Invalid directive type" };
            }
        } catch (error) {
            return { Error: error };
        }
    }

    #parseDiceRoll(directiveObj) {
        try {
            this.lastRoll = this.rollDice();
            this.giveResourcesByRoll(this.lastRoll);
            this.#setDirectiveExpetation(directiveTypes.rollDice);
            return `Player ${directiveObj.player} has rolled ${this.lastRoll}`;
        } catch (error) {
            return { Error: error };
        }
    }

    #parseBuild(directiveObj) {
        try {
            let retMsg;
            const itemToBuild = directiveObj.item.type;
            switch (itemToBuild) {
                case pieceTypes.SETTELMENT:
                    retMsg = this.buildSettelment(directiveObj.player, itemToBuild.x, itemToBuild.y, true);
                    break;
                case pieceTypes.CITY:
                    retMsg = this.buildCity(directiveObj.player, itemToBuild.x, itemToBuild.y, true);
                    break;
                case pieceTypes.ROAD:
                    const { startX, startY, endX, endY } = itemToBuild;
                    retMsg = this.buildRoad(directiveObj.player, startX, startY, endX, endY, true);
                    break;
                case pieceTypes.DEVCARD:
                    retMsg = this.buildDevCard(directiveObj.player);
                    break;
                default:
                    throw "Invalid build item";
            }
            this.#setDirectiveExpetation(directiveTypes.build);
            return retMsg;
        } catch (error) {
            return { Error: error };
        }
    }

    #parseDevCard(directiveObj) {
        try {
            const { player, card } = directiveObj;
            let retMsg;
            switch (card.type) {
                case devCards.knight.name:
                    const { newRobberX, newRobberY } = card;
                    retMsg = this.activateKnight(player, newRobberX, newRobberY);
                    this.isAwaitingRobb = true;
                    break;
                case devCards.monopoly.name:
                    retMsg = this.activateMonopoly(player, card.resource);
                    break;
                case devCards.roadBuilding.name:
                    const { firstRoadStartX, firstRoadStartY, firstRoadEndX, firstRoadEndY, secondRoadStartX, secondRoadStartY, secondRoadEndX, secondRoadEndY } = card;
                    retMsg = this.activateRoadBuilding(player, firstRoadStartX, firstRoadStartY, firstRoadEndX, firstRoadEndY, secondRoadStartX, secondRoadStartY, secondRoadEndX, secondRoadEndY);
                    break;
                case devCards.yearOfPlenty.name:
                    const { resourceA, resourceB } = card;
                    retMsg = this.activateYearOfPlenty(player, resourceA, resourceB);
                default:
                    throw "Invalid dev card type";
            }
            this.#setDirectiveExpetation(directiveObj.type);
            return retMsg;
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
            return `Trade request sent from player ${player} to player ${tradeWith}`;
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
            let retMsg;
            if (!this.pendingTrade) {
                throw "No pending trade detected";
            }
            if (directiveObj.isAccepted) {
                const { offeringPlayer, offeringPlayerResources, offeredPlayer, offeredPlayerResources } = this.pendingTrade;
                retMsg = this.executeTrade(offeringPlayer, offeredPlayer, offeringPlayerResources, offeredPlayerResources);
            }
            this.#setDirectiveExpetation(directiveObj.type);
            return retMsg;
        } catch (error) {
            return { Error: error };
        }
    }

    #parseRobbPlayer(directiveObj) {
        try {
            const { player, playerToRob } = directiveObj;
            const retMsg = this.robbPlayer(player, playerToRob);
            this.isAwaitingRobb = false;
            this.#setDirectiveExpetation(directiveTypes.robbPlayer);
            return retMsg;
        } catch (error) {
            return { Error: error };
        }
    }

    #parseBuildSetup(directiveObj) {
        try {
            let retMsg;
            this.#validateSetupBuild(directiveObj);
            const itemToBuild = directiveObj.item.type;
            switch (itemToBuild) {
                case pieceTypes.SETTELMENT:
                    const { x, y } = directiveObj.item;
                    retMsg = this.buildSettelment(directiveObj.player, x, y, false)
                    break;
                case pieceTypes.ROAD:
                    const { startX, startY, endX, endY } = directiveObj.item;
                    retMsg = this.buildRoad(directiveObj.player, startX, startY, endX, endY, false);
                    break;
            }
            this.setupItemsCount++;
            if (this.setupItemsCount === 4 * this.players.length) {
                this.isSetupPhase = false;
            }

            this.#setDirectiveExpetation(directiveTypes.setupBuild);
            return retMsg;
        } catch (error) {
            return { Error: error };
        }
    }

    #parseEndTurn() {
        try {
            let retMsg;
            if (this.isSetupPhase) {
                const lastPlayer = this.setupOrder.shift()
                this.setupOrder.push(lastPlayer);
                if (this.setupItemsCount === 8) {
                    this.setupOrder.reverse();
                }

                retMsg = `${lastPlayer} has finished his turn. Now Its ${this.setupOrder[0]}'s turn.`;
            }
            else {
                const lastPlayer = this.playerOrder.shift()
                this.playerOrder.push(lastPlayer);
                this.isAwaitingRobb = false;
                this.#setDirectiveExpetation(directiveObj.type);
                retMsg = `${lastPlayer} has finished his turn. Now Its ${this.playerOrder[0]}'s turn.`;
            }
            this.#setDirectiveExpetation(directiveObj.type);
            const victory = this.checkVictory();
            if (victory) {
                this.#handleVictory(victory);
            }
            return retMsg;
        } catch (error) {
            return { Error: error };
        }
    }

    #parseTradeWithPort(directiveObj) {
        try {
            const { player, portType, resourceToGive, resourceToTake } = directiveObj;
            return this.tradeWithPort(portType, player, resourceToGive, resourceToTake);
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
                if (this.isAwaitingRobb) {
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

    #handleVictory(winnerObj) {
        const { color, points } = winnerObj;
        this.directiveExpectation = [];
        return `Player ${color} won with ${points} points!`;
    }
}
module.exports = catanAPI;