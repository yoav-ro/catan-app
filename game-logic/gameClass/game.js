const { dicesRoll, mixArray } = require("../utils/helperFunctions");
const { pieceTypes, resourcesTypes, devCardsArr, playerColors, devCards } = require("../utils/constants");
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
        this.initPickOrder = mixArray(playerColors);
    }

    activateMonopoly(playerColor, resourceType) {
        try {
            const resourceToAdd = [];
            playerColors.forEach(player => {
                if (player.color !== player) {
                    const resCount = player.countResources(resourceType);
                    const resourcesToRemove = Array(resCount).fill(resourceType);
                    player.removeResources(resourcesToRemove);
                    resourceToAdd.concat(resourcesToRemove);
                    player.activateDevCard(devCards.monopoly.name);
                }
            })
            this.#getPlayerByColor(playerColor).addResources(resourceToAdd);
        } catch (error) {
            return { Error: "Error: " + error };
        }
    }

    activateRoadBuilding(playerColor, road1StartX, road1StartY, road1EndX, road1EndY, road2StartX, road2StartY, road2EndX, road2EndY) {
        try {
            const player = this.#getPlayerByColor(playerColor);
            player.buildRoad(road1StartX, road1StartY, road1EndX, road1EndY, false);
            player.buildRoad(road2StartX, road2StartY, road2EndX, road2EndY, false);
            this.board.addRoad(playerColor, road1StartX, road1StartY, road1EndX, road1EndY);
            this.board.addRoad(playerColor, road2StartX, road2StartY, road2EndX, road2EndY);
            player.activateDevCard(devCards.monopoly.name);
        } catch (error) {
            return { Error: "Error: " + error };
        }

    }

    activateYearOfPlenty(playerColor, resourceA, resourceB) {
        try {
            const player = this.#getPlayerByColor(playerColor);
            player.addResources([resourceA, resourceB]);
            player.activateDevCard(devCards.yearOfPlenty.name);
        } catch (error) {
            return { Error: "Error: " + error };
        }
    }

    activateKnight(playerColor, newRobberRow, newRobberCell) {
        try {
            this.board.moveRobber(newRobberRow, newRobberCell);
            // this.robbPlayer()
        } catch (error) {
            return { Error: "Error: " + error };
        }
    }

    robbPlayer(robbingPlayerColor, robbedPlayerColor, resource) {
        const robbingPlayer = this.#getPlayerByColor(robbingPlayerColor);
        const robbed = this.#getPlayerByColor(robbedPlayerColor);
        robbed.removeResources([resource]);
        robbingPlayer.addResources([resource]);
    }

    initialBuildSettelment(playerColor, x, y) {
        if (playerColor === this.initPickOrder[0]) {
            const player = this.#getPlayerByColor(playerColor);
            if (player.settelments.length < 2) {
                this.buildSettelment(playerColor, x, y, false, false);
            }
        }
        const lastPlayer = this.initPickOrder.shift()
        this.initPickOrder.push(lastPlayer);
    }

    initialBuildRoad(playerColor, startX, startY, endX, endY) {
        if (playerColor === this.initPickOrder[0]) {
            const player = this.#getPlayerByColor(playerColor);
            if (player.roads.length < 2) {
                this.buildRoad(playerColor, startX, startY, endX, endY, true);
            }
        }
        const lastPlayer = this.initPickOrder.shift()
        this.initPickOrder.push(lastPlayer);
    }

    //Returns a random number between 1-12
    rollDice() {
        return dicesRoll();
    }

    //Give player their resources by roll
    giveResourcesByRoll(roll) {
        try {
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
        } catch (error) {
            return { Error: "Error: " + error };
        }

    }

    buildSettelment(playerColor, x, y, shouldTakeResources, shouldBeConnected) {
        try {
            const player = this.#getPlayerByColor(playerColor);
            player.buildSettelment(x, y, shouldTakeResources);
            this.board.addJunction(playerColor, x, y, pieceTypes.SETTELMENT, shouldBeConnected);
        } catch (error) {
            return { Error: "Error: " + error };
        }
    }

    buildCity(playerColor, x, y) {
        try {
            const player = this.#getPlayerByColor(playerColor);
            player.buildCity(x, y);
            this.board.addJunction(playerColor, x, y, pieceTypes.CITY, true);
        } catch (error) {
            return { Error: "Error: " + error };
        }
    }

    buildRoad(playerColor, startX, startY, endX, endY, shouldTakeResources) {
        try {
            const player = this.#getPlayerByColor(playerColor);
            player.buildRoad(startX, startY, endX, endY, shouldTakeResources);
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