const { dicesRoll, mixArray } = require("../utils/helperFunctions");
const { pieceTypes, resourcesTypes, devCardsArr } = require("../utils/constants");
const Player = require("../playerClass/player");
const Board = require("../boardClass/board");

class Game {
    constructor(playersDataArr, tileRadius) {
        this.board = new Board(tileRadius);
        this.players = [
            new Player(playersDataArr[0].name, playersDataArr[0].color),
            new Player(playersDataArr[1].name, playersDataArr[1].color),
            new Player(playersDataArr[2].name, playersDataArr[2].color),
            new Player(playersDataArr[3].name, playersDataArr[3].color)];
        this.devCards = mixArray(devCardsArr);
        this.currTurn = undefined;
        this.isSetupPhase = true;
    }
    
    activateMonopoly(playerColor, resourceType)
    {
        
    }

    activateRoadBuilding(playerColor, road1StartX, road1StartY, road1EndX, road1EndY,road2StartX, road2StartY, road2EndX, road2EndY)
    {}

    activateYearOfPlenty(playerColor, resourceA, resourceB)
    {}

    activateKnight(playerColor, newRobberX, newRobberY)
    {}



    //Give player their resources by roll
    rollDice(player) {
        try {
            if (player.color = this.currTurn) {
                const roll = dicesRoll();
                this.board.tiles.forEach(tile => {
                    if (tile.number === roll && tile.resource !== resourcesTypes.DESERT && !tile.isRobber) {
                        const resourceToGive = tile.resource;
                        for (let junction of surroundingJunctions) {
                            const player = this.#getPlayerByColor(junction.player);
                            if (junction.type === pieceTypes.CITY) {
                                player.addResources([resourceToGive, resourceToGive]);
                            }
                            if (junction.type === pieceTypes.SETTELMENT) {
                                player.addResources([resourceToGive]);
                            }
                        }
                    }
                });
            }
        } catch (error) {
            return { Error: "Error: " + error };
        }

    }

    buildSettelment(playerColor, x, y) {
        try {
            const player = this.#getPlayerByColor(playerColor);
            player.buildSettelment(x, y);
            this.board.addJunction(playerColor, x, y, pieceTypes.SETTELMENT);
        } catch (error) {
            return { Error: "Error: " + error };
        }
    }

    buildCity(playerColor, x, y) {
        try {
            const player = this.#getPlayerByColor(playerColor);
            player.buildCity(x, y);
            this.board.addJunction(playerColor, x, y, pieceTypes.CITY);
        } catch (error) {
            return { Error: "Error: " + error };
        }
    }

    buildRoad(playerColor, startX, startY, endX, endY) {
        try {
            const player = this.#getPlayerByColor(playerColor);
            player.buildRoad(startX, startY, endX, endY);
            this.board.addRoad(playerColor, startX, startY, endX, endY);
        } catch (error) {
            return { Error: "Error: " + error };
        }
    }

    buildDevCard(playerColor) {
        const card = this.devCards.pop();
        try {
            const player = this.#getPlayerByColor(playerColor);
            player.buyDevCard(card);
        } catch (error) {
            this.devCards.push(card);
            return { Error: "Error: " + error };
        }
    }

    #getPlayerByColor(color) {
        this.players.forEach(player => {
            if (player.color === color) {
                return player;
            }
        })
    }
}

module.exports = Game;