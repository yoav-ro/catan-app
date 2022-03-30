const { dicesRoll, mixArray, randomItemFromArray, doesArrayContain } = require("../utils/helperFunctions");
const { pieceTypes, resourcesTypes, devCardsArr, playerColors, devCards, ports } = require("../utils/constants");
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
        this.largestArmyPlayer = undefined;
        this.longestRoadPlayer = undefined;
    }

    activateMonopoly(playerColor, resourceType) {
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
        return `Monopoly (${resourceType}) was used by player ${playerColor}`;
    }

    activateRoadBuilding(playerColor, road1StartX, road1StartY, road1EndX, road1EndY, road2StartX, road2StartY, road2EndX, road2EndY) {
        const player = this.#getPlayerByColor(playerColor);
        player.buildRoad(road1StartX, road1StartY, road1EndX, road1EndY, false);
        player.buildRoad(road2StartX, road2StartY, road2EndX, road2EndY, false);
        this.board.addRoad(playerColor, road1StartX, road1StartY, road1EndX, road1EndY);
        this.board.addRoad(playerColor, road2StartX, road2StartY, road2EndX, road2EndY);
        player.activateDevCard(devCards.monopoly.name);
        return `Road building was used by player ${playerColor}`;
    }

    activateYearOfPlenty(playerColor, resourceA, resourceB) {
        const player = this.#getPlayerByColor(playerColor);
        player.addResources([resourceA, resourceB]);
        player.activateDevCard(devCards.yearOfPlenty.name);
        return `Year of plenty was used by player ${playerColor}`;
    }

    activateKnight(playerColor, newRobberRow, newRobberCell) {
        this.board.moveRobber(newRobberRow, newRobberCell);
        const player = this.#getPlayerByColor(playerColor);
        player.activeKnights++;
        this.#setLargestArmy();
        return `A knight was activated by player ${playerColor}`;
    }

    robbPlayer(robbingPlayerColor, robbedPlayerColor) {
        const robbingPlayer = this.#getPlayerByColor(robbingPlayerColor);
        const robbed = this.#getPlayerByColor(robbedPlayerColor);
        const resToRobb = randomItemFromArray(robbed.resources);
        robbed.removeResources([resToRobb]);
        robbingPlayer.addResources([resToRobb]);
        return `Player ${robbedPlayerColor} was robbed by player ${robbingPlayerColor}`;
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
        return `Player ${playerColor} built a settelment`;
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
        return `Player ${playerColor} built a road`;
    }

    #setLargestArmy() {
        let mostKnights = 0;
        let mostKnightsPlayer;
        players.forEach(player => {
            if (player.activeKnights > mostKnights) {
                mostKnights = player.activeKnights;
                mostKnightsPlayer = player;
            }
        });
        if (this.largestArmyPlayer) { //If the largest army needs to be taken from someone
            if (mostKnightsPlayer.activeKnights > this.largestArmyPlayer.activeKnights) {
                const lastLargestArmy = this.largestArmyPlayer;
                mostKnightsPlayer.addPoints(2);
                this.largestArmyPlayer.removePoints(2);
                this.largestArmyPlayer = mostKnightsPlayer;
                return `The largest army was taken from ${lastLargestArmy} by ${this.largestArmyPlayer}`;
            }
        }
        else if (mostKnightsPlayer.activeKnights >= 3) { //If no one had the largest army before
            mostKnightsPlayer.addPoints(2);
            this.largestArmyPlayer = mostKnightsPlayer;
            return `${this.largestArmyPlayer} now has the largest army`;
        }
    }

    #setLongestRoadPlayer() {
        const longestRoad = this.board.longestRoad;
        if (longestRoad.length >= 5) {
            if (this.longestRoadPlayer) {
                if (longestRoad[0].player !== this.longestRoadPlayer) {
                    this.#getPlayerByColor(this.longestRoadPlayer).removePoints(2);
                    this.longestRoadPlayer = longestRoad[0].player;
                    this.#getPlayerByColor(this.longestRoadPlayer).addPoints(2);
                    return `. ${this.longestRoadPlayer} now has the longest road`;
                }
            } else {
                this.longestRoadPlayer = longestRoad[0].player;
                this.#getPlayerByColor(this.longestRoadPlayer).addPoints(2);
                return `. ${this.longestRoadPlayer} now has the longest road`;
            }
        }
    }

    //Returns a random number between 1-12
    rollDice() {
        return dicesRoll();
    }

    //Give player their resources by roll
    giveResourcesByRoll(roll) {
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

    getPiecesByPlayer(playerColor, pieceType) {
        const player = this.#getPlayerByColor(playerColor);
        switch (pieceType) {
            case pieceTypes.CITY:
                return 4 - player.citiesLeft;
            case pieceTypes.DEVCARD:
                return player.devCards.length;
            case pieceTypes.ROAD:
                return 15 - player.roadsLeft;
            case pieceTypes.SETTELMENT:
                return 5 - player.settelmentsLeft;
        }
    }

    buildSettelment(playerColor, x, y, shouldTakeResources, shouldBeConnected) {
        const player = this.#getPlayerByColor(playerColor);
        player.buildSettelment(x, y, shouldTakeResources);
        this.board.addJunction(playerColor, x, y, pieceTypes.SETTELMENT, shouldBeConnected);
        const longestRoadMsg = this.#setLongestRoadPlayer();
        return `Player ${playerColor} built a settelment` + longestRoadMsg;
    }

    buildCity(playerColor, x, y) {
        const player = this.#getPlayerByColor(playerColor);
        player.buildCity(x, y);
        this.board.addJunction(playerColor, x, y, pieceTypes.CITY, true);
        return `Player ${playerColor} built a city`;
    }

    buildRoad(playerColor, startX, startY, endX, endY, shouldTakeResources) {
        const player = this.#getPlayerByColor(playerColor);
        player.buildRoad(startX, startY, endX, endY, shouldTakeResources);
        this.board.addRoad(playerColor, startX, startY, endX, endY);
        const longestRoadMsg = this.#setLongestRoadPlayer();
        return `Player ${playerColor} built a road` + longestRoadMsg;
    }

    buildDevCard(playerColor) {
        const card = this.devCards.pop();
        const player = this.#getPlayerByColor(playerColor);
        player.buyDevCard(card);
        return `Player ${playerColor} purchesed a development card`;
    }

    executeTrade(playerA, playerB, resPlayerA, resPlayerB) {
        const playerA = this.#getPlayerByColor(playerA);
        const playerB = this.#getPlayerByColor(playerB);

        playerA.removeResources(resPlayerA);
        playerB.removeResources(resPlayerB);

        playerA.addResources(resPlayerB);
        playerB.addResources(resPlayerA);
        return `Trade made succesfully`
    }

    tradeWithPort(portType, playerColor, resourceToGive, resourceToTake) {
        const player = this.#getPlayerByColor(playerColor);
        if (portType === "bank") {
            if (doesArrayContain(player.resources, Array(4).fill(resourceToGive))) {
                player.removeResources(Array(4).fill(resourceToGive));
                player.addResources([resourceToTake]);
                return "Trade made succesfully";
            }
        }
        if (this.#playerHasPort(playerColor, portType)) {
            const numOfResToTake = portType === "3to1" ? 3 : 2;
            player.removeResources(Array(numOfResToTake).fill(resourceToGive));
            player.addResources([resourceToTake]);
            return "Trade made succesfully";
        }
        else {
            throw `Player ${playerColor} does not have access to this port (${portType})`;
        }
    }

    #playerHasPort(playerColor, portType) {
        const player = this.#getPlayerByColor(playerColor);
        const portsByType = this.board.getPortsByType(portType);

        player.settelments.forEach(settelment => {
            portsByType.forEach(port => {
                if (port.junctionA.x === settelment.x && port.junctionA.x === settelment.y) {
                    return true;
                }
                if (port.junctionB.x === settelment.x && port.junctionB.x === settelment.y) {
                    return true;
                }
            })
        })
        return false;
    }

    checkVictory() {
        this.players.forEach(player => {
            if (player.points >= 10) {
                return {
                    color: player.color,
                    points: player.points,
                };
            }
        })
        return false;
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