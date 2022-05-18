const Game = require("../gameClass/game");
const { pieceTypes, devCards } = require("../utils/constants");
const { mixArray } = require("../utils/helperFunctions");
const { directiveTypes } = require("./apiConstants");

class catanAPI extends Game {
    constructor(playersDataArr, tileRadius) {
        super(playersDataArr, tileRadius)
        this.playerOrder = mixArray(playersDataArr.slice()); //playerOrder[0] is the current player
        this.setupOrder = mixArray(playersDataArr.slice())
        this.directiveExpectation = [directiveTypes.setupBuild];
        this.isSetupPhase = true;
        this.isAwaitingRobb = false;
        this.lastRoll = undefined;
        this.pendingTrade = undefined;
    }

    //Recieves a directive and replies with the updated game data
    sendDirective(directiveObj) {
        const directiveMsg = this.#parseDirective(directiveObj);
        console.log(this.directiveExpectation);
        return {
            gameData: this,
            message: directiveMsg,
            expectation: this.directiveExpectation,
        }
    }

    //Handles directive parsing by type
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
                case directiveTypes.buyDevCard:
                    return this.#parseGetDevCard(directiveObj); //good
                case directiveTypes.dropResources:
                    return this.#parseDropResources(directiveObj);
                default:
                    return { error: "Invalid directive type" };
            }
        } catch (error) {
            console.log(error)
            return { error: error };
        }
    }

    // Parsing a dice roll directive
    #parseDiceRoll(directiveObj) {
        try {
            this.lastRoll = this.rollDice();
            const totalRoll = this.lastRoll.dice1 + this.lastRoll.dice2;
            this.giveResourcesByRoll(totalRoll);
            this.#setDirectiveExpetation(directiveObj);
            return `Player ${directiveObj.player} has rolled ${totalRoll} (${this.lastRoll.dice1} + ${this.lastRoll.dice2})`;
        } catch (error) {
            return { error: error };
        }
    }

    // Parsing a build directive
    #parseBuild(directiveObj) {
        try {
            let retMsg;
            const itemToBuild = directiveObj.item.type;
            switch (itemToBuild) {
                case pieceTypes.SETTELMENT:
                    retMsg = this.buildSettelment(directiveObj.player, directiveObj.item.x, directiveObj.item.y, true);
                    break;
                case pieceTypes.CITY:
                    retMsg = this.buildCity(directiveObj.player, directiveObj.item.x, directiveObj.item.y, true);
                    break;
                case pieceTypes.ROAD:
                    const { startX, startY, endX, endY } = directiveObj.item;
                    retMsg = this.buildRoad(directiveObj.player, startX, startY, endX, endY, true);
                    break;
                case pieceTypes.DEVCARD:
                    retMsg = this.buildDevCard(directiveObj.player);
                    break;
                default:
                    throw "Invalid build item";
            }
            this.#setDirectiveExpetation(directiveObj);
            return retMsg;
        } catch (error) {
            return { error: error };
        }
    }

    // Parsing a resource drop directive
    #parseDropResources(directiveObj) {
        try {
            this.#validateDropResources(directiveObj);
            const { player, resources } = directiveObj;
            const retMsg = this.dropResources(player, resources)
            this.#setDirectiveExpetation(directiveObj);
            return retMsg;
        } catch (error) {
            return { error: error }
        }
    }

    //Parsing a dev card purchase directive
    #parseGetDevCard(directiveObj) {
        try {
            const buyingPlayer = directiveObj.player;
            return this.buildDevCard(buyingPlayer);
        } catch (error) {
            return { error: error }
        }
    }

    //Parsing a dev card activation direcing
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
                    break;
                default:
                    throw "Invalid dev card type";
            }
            this.#setDirectiveExpetation(directiveObj);
            return retMsg;
        } catch (error) {
            return { error: error };
        }
    }

    //Parsing a trade request directive
    #parseTradeReq(directiveObj) {
        try {
            const { player, tradeWith, givenResources, recievedResources } = directiveObj;
            this.#validateTradeReq(player, tradeWith, givenResources, recievedResources);
            this.#setPendingTrade(player, tradeWith, givenResources, recievedResources);
            this.#setDirectiveExpetation(directiveObj);
            return `Trade request sent from player ${player} to player ${tradeWith}`;
        } catch (error) {
            return { error: error };
        }
    }

    //Validating a trade request directive
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

    //Parsing a trade response directive
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
            this.#setDirectiveExpetation(directiveObj);
            return retMsg;
        } catch (error) {
            return { error: error };
        }
    }

    //Parsing a player robb directive
    #parseRobbPlayer(directiveObj) {
        try {
            const { player, playerToRob } = directiveObj;
            const retMsg = this.robbPlayer(player, playerToRob);
            this.isAwaitingRobb = false;
            this.#setDirectiveExpetation(directiveObj);
            return retMsg;
        } catch (error) {
            return { error: error };
        }
    }

    //Parsing a setup build directive
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
            if (this.#shouldAdvanceTurnAfterSetup(directiveObj)) {
                this.#parseEndTurn({
                    type: "endTurn",
                    player: directiveObj.player,
                })
            }

            this.#setDirectiveExpetation(directiveObj);
            return retMsg;
        } catch (error) {
            return { error: error };
        }
    }

    //Parsing an end turn directive
    #parseEndTurn(directiveObj) {
        try {
            let retMsg;
            if (this.isSetupPhase) {
                const lastPlayer = this.setupOrder.shift()
                this.setupOrder.push(lastPlayer);
                const builtItemsCount = this.board.builtJunctions.length + this.board.roads.length;
                if (builtItemsCount === 2 * this.players.length) {
                    this.setupOrder.reverse();
                }

                retMsg = `${lastPlayer.color} has finished his turn. Now Its ${this.setupOrder[0].color}'s turn.`;
            }
            else {

                const lastPlayer = this.playerOrder.shift()
                this.playerOrder.push(lastPlayer);
                this.isAwaitingRobb = false;
                this.makeDevCardUseAble(lastPlayer.color);
                this.#setDirectiveExpetation(directiveObj);
                retMsg = `${lastPlayer.color} has finished his turn. Now Its ${this.playerOrder[0].color}'s turn.`;
            }
            this.#setDirectiveExpetation(directiveObj);
            const victory = this.checkVictory();
            if (victory) {
                this.#handleVictory(victory);
            }
            return retMsg;
        } catch (error) {
            return { error: error };
        }
    }

    //Parsing a trade with port direcive
    #parseTradeWithPort(directiveObj) {
        try {
            const { player, portType, resourceToGive, resourceToTake } = directiveObj;
            return this.tradeWithPort(portType, player, resourceToGive, resourceToTake);
        } catch (error) {
            return { error: error };
        }
    }

    //Validates if the given player has the current turn
    #validatePlayer(playerColor) {
        if (playerColor !== this.playerOrder[0].color) {
            throw `This is not ${playerColor}'s turn`;
        }
    }

    //Validates if the given player has the current turn in the setup phase
    #validatePlayerSetup(playerColor) {
        if (playerColor !== this.setupOrder[0].color) {
            throw `This is not ${playerColor}'s turn`;
        }
    }

    //Validates setup build directive
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
            this.giveInitialResources(directiveObj.item.x, directiveObj.item.y, player)
        }
        if (settelmentsByPlayer === 2 && roadsByPlayer === 1) {
            if (pieceToBuild !== pieceTypes.ROAD) {
                throw "Build a second road first";
            }
        }
    }

    #validateDropResources(directiveObj) {
        const droppingPlayer = this.droppingPlayers.find(player => player.color === directiveObj.player);
        if (!droppingPlayer) {
            throw `Player ${directiveObj.player} isnt required to drop resources`;
        }
    }

    //Checking if the current setup turn should advance to the next player
    #shouldAdvanceTurnAfterSetup(directiveObj) {
        const player = directiveObj.player;
        const settelmentsByPlayer = this.getPiecesByPlayer(player, pieceTypes.SETTELMENT);
        const roadsByPlayer = this.getPiecesByPlayer(player, pieceTypes.ROAD);
        if ((settelmentsByPlayer === 1 && roadsByPlayer === 1) || (settelmentsByPlayer === 2 && roadsByPlayer === 2)) {
            return true;
        }
        return false;
    }

    //Sets the next possible directives by the last directive
    #setDirectiveExpetation(lastDirective) {
        const lastDirectiveType = lastDirective.type;
        this.directiveExpectation = [];
        const { endTurn, robbPlayer, rollDice, build, activateDevCard, tradeReq, tradeRes, setupBuild, buyDevCard, dropResources } = directiveTypes;
        switch (lastDirectiveType) {
            case directiveTypes.endTurn:
                this.directiveExpectation = [rollDice, activateDevCard];
                break;
            case directiveTypes.rollDice:
                this.directiveExpectation = [endTurn, build, activateDevCard, tradeReq, buyDevCard];
                if (this.lastRoll.dice1 + this.lastRoll.dice2 === 7) {
                    if (this.droppingPlayers.length > 0) {
                        this.directiveExpectation = [dropResources];
                    }
                    else {
                        this.directiveExpectation = [endTurn, build, activateDevCard, tradeReq, buyDevCard, robbPlayer];
                    }
                }
                break;
            case directiveTypes.build:
                this.directiveExpectation = [endTurn, build, activateDevCard, tradeReq, buyDevCard];
                break;
            case directiveTypes.activateDevCard:
                this.directiveExpectation = [endTurn, build, tradeReq, buyDevCard];
                if (this.isAwaitingRobb) {
                    this.directiveExpectation.push(robbPlayer);
                }
                break;
            case directiveTypes.tradeReq:
                this.directiveExpectation = [endTurn, build, activateDevCard, tradeRes, buyDevCard];
                break;
            case directiveTypes.tradeRes:
                this.directiveExpectation = [endTurn, build, activateDevCard, tradeReq, buyDevCard];
                break;
            case directiveTypes.robbPlayer:
                this.directiveExpectation = [endTurn, build, activateDevCard, tradeReq, buyDevCard];
                break;
            case directiveTypes.setupBuild:
                if (this.isSetupPhase) {
                    this.directiveExpectation = [setupBuild];
                    if (lastDirective.item.type === pieceTypes.ROAD) {
                        this.directiveExpectation.push(endTurn);
                    }
                    const builtItemsCount = this.board.builtJunctions.length + this.board.roads.length;
                    if (builtItemsCount === 4 * this.players.length) {
                        this.isSetupPhase = false;
                        this.directiveExpectation = [rollDice, activateDevCard];
                    }
                }
                else {
                    this.directiveExpectation = [endTurn, build, tradeReq, activateDevCard, buyDevCard];
                }
                break;
            case directiveTypes.dropResources:
                if (this.droppingPlayers.length > 0) { //The games shouldnt accept any directive until all required players drop their resources
                    this.directiveExpectation = [dropResources];
                }
                else {
                    this.directiveExpectation = [endTurn, build, activateDevCard, tradeReq, buyDevCard, robbPlayer];
                }
                break;
            default:
                break;
        }
    }

    //Sets the pending trade to the given trade request
    #setPendingTrade(playerA, playerB, resPlayerA, resPlayerB) {
        const pendingTradeObj = {
            offeringPlayer: playerA,
            offeringPlayerResources: resPlayerA,
            offeredPlayer: playerB,
            offeredPlayerResources: resPlayerB,
        }

        this.pendingTrade = pendingTradeObj;
    }

    //Validates the new directive is playable
    #validateDirective(directiveObj) {
        if (this.isSetupPhase) {
            if (directiveObj.type !== directiveTypes.setupBuild) {
                throw "Invalid directive. At setup phase only a setup build is accepted.";
            }
            this.#validatePlayerSetup(directiveObj.player);
        }
        else {
            if (this.droppingPlayers.length === 0) {
                this.#validatePlayer(directiveObj.player);
            }
            if (this.droppingPlayers.length > 0 && directiveObj.type !== directiveTypes.dropResources) {
                throw "Wait for all players to finish dropping their resources.";
            }
            if (!this.directiveExpectation.includes(directiveObj.type)) {
                throw "Invalid directive. The next directive has to be one of: " + this.directiveExpectation;
            }
        }
    }

    //Checks if the game was won
    #handleVictory(winnerObj) {
        const { color, points } = winnerObj;
        this.directiveExpectation = [];
        return `Player ${color} won with ${points} points!`;
    }
}
module.exports = catanAPI;