const { dicesRoll, mixArray, randomItemFromArray, doesArrayContain, roundBySecondDec } = require("../utils/helperFunctions");
const { pieceTypes, resourcesTypes, devCardsArr, playerColors, devCards, ports, buildingCosts } = require("../utils/constants");
const Player = require("../playerClass/Player");
const Board = require("../boardClass/Board");

class Game {
    constructor(playersDataArr, tileRadius) {
        this.board = new Board(tileRadius);
        this.players = [
            new Player(playersDataArr[0].name, playersDataArr[0].color),
            new Player(playersDataArr[1].name, playersDataArr[1].color),
            new Player(playersDataArr[2].name, playersDataArr[2].color),
            new Player(playersDataArr[3].name, playersDataArr[3].color)];
        this.devCards = mixArray(devCardsArr.slice());
        this.initPickOrder = mixArray([playerColors.BLUE, playerColors.ORANGE, playerColors.RED, playerColors.WHITE]);
        this.droppingPlayers = [];
        this.largestArmyPlayer = undefined;
        this.longestRoadPlayer = undefined;
    }

    #getPlayerByColor(color) {
        let ret;
        this.players.forEach(player => {
            if (player.color === color) {
                ret = player;
            }
        })
        return ret;
    }

    activateMonopoly(playerColor, resourceType) {
        let resourceToAdd = [];
        const activatingPlayer = this.#getPlayerByColor(playerColor);
        activatingPlayer.validateDevCard(devCards.monopoly.name);
        this.players.forEach(player => {
            if (player.color !== playerColor) {
                const resCount = player.countResources(resourceType);
                const resourcesToRemove = Array(resCount).fill(resourceType);
                player.removeResources(resourcesToRemove);
                resourceToAdd = resourceToAdd.concat(resourcesToRemove);
            }
        })
        activatingPlayer.activateDevCard(devCards.monopoly.name);
        activatingPlayer.addResources(resourceToAdd);
        return `Monopoly (${resourceType}) was used by player ${playerColor}`;
    }

    activateRoadBuilding(playerColor, road1StartX, road1StartY, road1EndX, road1EndY, road2StartX, road2StartY, road2EndX, road2EndY) {
        const player = this.#getPlayerByColor(playerColor);
        player.validateDevCard(devCards.roadBuilding.name);
        player.buildRoad(road1StartX, road1StartY, road1EndX, road1EndY, false);
        player.buildRoad(road2StartX, road2StartY, road2EndX, road2EndY, false);
        this.board.addRoad(playerColor, road1StartX, road1StartY, road1EndX, road1EndY);
        this.board.addRoad(playerColor, road2StartX, road2StartY, road2EndX, road2EndY);
        player.activateDevCard(devCards.roadBuilding.name);
        return `Road building was used by player ${playerColor}`;
    }

    activateYearOfPlenty(playerColor, resourceA, resourceB) {
        const player = this.#getPlayerByColor(playerColor);
        player.validateDevCard(devCards.yearOfPlenty.name);
        player.activateDevCard(devCards.yearOfPlenty.name);
        player.addResources([resourceA, resourceB]);
        return `Year of plenty was used by player ${playerColor}`;
    }

    activateKnight(playerColor) {
        const player = this.#getPlayerByColor(playerColor);
        player.validateDevCard(devCards.knight.name);
        player.activateDevCard(devCards.knight.name);
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
        this.players.forEach(player => {
            if (player.activeKnights > mostKnights) {
                mostKnights = player.activeKnights;
                mostKnightsPlayer = player;
            }
        });
        if (this.largestArmyPlayer) { // If the largest army needs to be taken from someone
            if (mostKnightsPlayer.activeKnights > this.largestArmyPlayer.activeKnights) {
                const lastLargestArmy = this.largestArmyPlayer;
                mostKnightsPlayer.addPoints(2);
                this.largestArmyPlayer.removePoints(2);
                this.largestArmyPlayer = mostKnightsPlayer.color;
                return `The largest army was taken from ${lastLargestArmy} by ${this.largestArmyPlayer}`;
            }
        }
        else if (mostKnightsPlayer.activeKnights >= 3) { // If no one had the largest army before
            mostKnightsPlayer.addPoints(2);
            this.largestArmyPlayer = mostKnightsPlayer.color;
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

    // Returns a random number between 1-12
    rollDice() {
        return dicesRoll();
    }

    // Give player their resources by roll
    giveResourcesByRoll(roll) {
        if (roll !== 7) {
            this.board.tiles.forEach(tile => {
                if (tile.number === roll && tile.resource !== resourcesTypes.DESERT && !tile.isRobber) {
                    const resourceToGive = tile.resource;
                    const surroundingJunctions = this.#getTileCoordsArr(tile);
                    for (let junction of surroundingJunctions) {
                        for (let builtJunction of this.board.builtJunctions) {
                            if (roundBySecondDec(junction.x) === roundBySecondDec(builtJunction.x) && roundBySecondDec(junction.y) === roundBySecondDec(builtJunction.y)) {
                                const player = this.#getPlayerByColor(builtJunction.player);
                                if (builtJunction.type === pieceTypes.CITY) {
                                    player.addResources([resourceToGive, resourceToGive]);
                                }
                                if (builtJunction.type === pieceTypes.SETTELMENT) {
                                    player.addResources([resourceToGive]);
                                }
                            }
                        }
                    }
                }
            });
        }
        else {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].resources.length > 7) {
                    this.droppingPlayers.push(this.players[i]);
                }
            }
        }
    }

    dropResources(playerColor, resourcesToDrop) {
        const player = this.#getPlayerByColor(playerColor);
        if (!doesArrayContain(player.resources, resourcesToDrop)) {
            throw `Drop declined. Player ${playerColor} doesnt have the required resources.`;
        }
        const requiredDropCount = player.resources.length % 2 > 0 ? (player.resources.length / 2) - 0.5 : player.resources.length / 2;
        if (resourcesToDrop.length !== requiredDropCount) {
            throw `Drop declined. Player ${playerColor} should drop exactly ${requiredDropCount} resources.`;
        }
        player.removeResources(resourcesToDrop);
        const playerIndex = this.droppingPlayers.findIndex(player => player.color === playerColor);
        this.droppingPlayers.splice(playerIndex, 1);
        return `Player ${playerColor} has dropped ${resourcesToDrop.length} resources`;
    }

    giveInitialResources(settelmentX, settelmentY, playerColor) {
        const player = this.#getPlayerByColor(playerColor);
        for (let tile of this.board.tiles) {
            const surroundingJunctions = this.#getTileCoordsArr(tile);
            for (let junction of surroundingJunctions) {
                const resourceToGive = tile.resource;
                if (resourceToGive !== resourcesTypes.DESERT && roundBySecondDec(junction.x) === roundBySecondDec(settelmentX) && roundBySecondDec(junction.y) === roundBySecondDec(settelmentY)) {
                    player.addResources([resourceToGive]);
                }
            }
        }
    }

    #getTileCoordsArr(tile) {
        const junctionsArr = [];
        for (let junction in tile.coordinates) {
            junctionsArr.push(tile.coordinates[junction]);
        }
        return junctionsArr;
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
        if (player.canBuildSettlement(x, y, shouldTakeResources) && this.board.canPlaceSettelmentOrCity(player, x, y, pieceTypes.SETTELMENT, shouldTakeResources)) {
            player.buildSettelment(x, y, shouldTakeResources);
            this.board.addJunction(playerColor, x, y, pieceTypes.SETTELMENT, shouldBeConnected);
            const longestRoadMsg = this.#setLongestRoadPlayer();
            return [`Player ${playerColor} built a settelment`, longestRoadMsg];
        }
    }

    buildCity(playerColor, x, y) {
        const player = this.#getPlayerByColor(playerColor);
        if (player.canBuildCity(x, y) && this.board.canPlaceSettelmentOrCity(player, x, y, pieceTypes.CITY, true)) {
            player.buildCity(x, y);
            this.board.addJunction(playerColor, x, y, pieceTypes.CITY, true);
            return `Player ${playerColor} built a city`;
        }
    }

    buildRoad(playerColor, startX, startY, endX, endY, shouldTakeResources) {
        const player = this.#getPlayerByColor(playerColor);
        if (player.canBuildRoad(startX, startY, endX, endY, shouldTakeResources) && this.board.canPlaceRoad(playerColor, startX, startY, endX, endY)) {
            player.buildRoad(startX, startY, endX, endY, shouldTakeResources);
            this.board.addRoad(playerColor, startX, startY, endX, endY);
            const longestRoadMsg = this.#setLongestRoadPlayer();
            return [`Player ${playerColor} built a road`, longestRoadMsg];
        }
    }

    buildDevCard(playerColor) {
        if (this.devCards.length > 0) {
            if (this.canBuildDevCard(playerColor)) {
                const card = this.devCards.pop();
                const player = this.#getPlayerByColor(playerColor);
                player.buyDevCard(card);
                return `Player ${playerColor} purchesed a development card`;
            }
        }
        throw "No development cards left";
    }

    canBuildDevCard(playerColor) {
        const player = this.#getPlayerByColor(playerColor);
        if (this.devCards.length === 0) {
            throw "All development cards used";
        }
        if (player.canBuyDevCard()) {
            return true;
        }
    }

    makePlayerDevCardUseable(playerColor) {
        const player = this.#getPlayerByColor(playerColor);
        player.makeDevCardUseAble();
    }

    executeTrade(playerAColor, playerBColor, resPlayerA, resPlayerB) {
        const playerA = this.#getPlayerByColor(playerAColor);
        const playerB = this.#getPlayerByColor(playerBColor);

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

        for (let settelment of player.settelments) {
            for (let port of portsByType) {
                if (roundBySecondDec(port.junctionA.x) === roundBySecondDec(settelment.x) && roundBySecondDec(port.junctionA.x) === roundBySecondDec(settelment.y)) {
                    return true;
                }
                if (roundBySecondDec(port.junctionB.x) === roundBySecondDec(settelment.x) && roundBySecondDec(port.junctionB.x) === roundBySecondDec(settelment.y)) {
                    return true;
                }
            }
        }
        return false;
    }

    checkVictory() {
        for (let player of this.players) {
            if (player.points >= 10) {
                return {
                    color: player.color,
                    points: player.points,
                };
            }
        }
        return false;
    }
}

module.exports = Game;