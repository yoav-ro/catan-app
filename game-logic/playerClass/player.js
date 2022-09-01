const { buildingCosts, devCards, pieceTypes, resourcesTypes } = require("../utils/constants");
const { doesArrayContain, countItemsInArray } = require("../utils/helperFunctions")

class Player {
    constructor(name, color) {
        this.playerName = name;
        this.color = color;
        // this.points = color === "blue" ? 9 : 0;
        this.points = 0;
        this.citiesLeft = 4;
        this.settlementsLeft = 5;
        this.roadsLeft = 15;
        // this.resources = [];
        this.resources = [ // for easier testing
            resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD,
            resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT,
            resourcesTypes.BRICK, resourcesTypes.BRICK, resourcesTypes.BRICK, resourcesTypes.BRICK, resourcesTypes.BRICK, resourcesTypes.BRICK,
            resourcesTypes.IRON, resourcesTypes.IRON, resourcesTypes.IRON, resourcesTypes.IRON, resourcesTypes.IRON, resourcesTypes.IRON,
            resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP,
        ]
        this.settlements = [];
        this.cities = [];
        this.roads = [];
        this.playerDevCards = [];
        this.activeKnights = 0;
    }

    // Adds new resources to the player
    addResources(resourcesToAddArr) {
        this.resources = this.resources.concat(resourcesToAddArr);
    }

    // Validates that the player can play the given dev card
    validateDevCard(devCardType) {
        let doesPlayerHaveCard = false;
        let doesPlayerHaveUnusedCard = false;
        let isCardUseAble = false;
        for (let card of this.playerDevCards) {
            if (card.name === devCardType) {
                doesPlayerHaveCard = true;
                if (!card.isUsed) {
                    doesPlayerHaveUnusedCard = true;
                }
                if (!card.isCardUseAble) {
                    isCardUseAble = true;
                }
            }
        }

        if (!doesPlayerHaveCard) {
            throw "Player doesnt have this card (" + devCardType + ")";
        }
        if (!doesPlayerHaveUnusedCard) {
            throw "Development card already used";
        }
        if (!isCardUseAble) {
            throw "Cant use this card yet";
        }
    }

    // Activaes the given dev card
    activateDevCard(devCardType) {
        const card = this.playerDevCards.find(card => card.name === devCardType && !card.isUsed && card.isUseAble);
        if (!card.isUsed) {
            card.isUsed = true;
        }
    }

    // Counts all the player's resources by type 
    countResources(resourceType) {
        return countItemsInArray(this.resources, resourceType);
    }

    // Making all the player's dev cards useable
    makeDevCardUseAble() {
        for (let card of this.playerDevCards) {
            card.isUseAble = true;
        }
    }

    // Remove the given resources from the player's hand
    removeResources(resourcesToRemoveArr) {
        if (doesArrayContain(this.resources, resourcesToRemoveArr)) {
            resourcesToRemoveArr.forEach(item => {
                const itemIndex = this.resources.indexOf(item);
                this.resources.splice(itemIndex, 1);
            });
        }
    }

    // Add points to the player
    addPoints(pointsToAdd) {
        this.points += pointsToAdd;
    }

    // Remove points from the player
    removePoints(pointsToRemove) {
        if (pointsToRemove > this.points) {
            this.points = 0;
        }
        else {
            this.points -= pointsToRemove;
        }
    }

    // Adds a new city to the player
    buildCity(x, y) {
        for (let i = 0; i < this.settlements.length; i++) {
            if (this.settlements[i].x === x && this.settlements[i].y === y) {
                const cityObject = {
                    x: x,
                    y: y,
                }
                this.cities.push(cityObject);
                this.citiesLeft--;
                this.settlementsLeft++;
                this.settlements.splice(i, 1);
                this.removeResources(buildingCosts.city);
                this.addPoints(1);
                break;
            }
        }
    }

    // Validates if the player can build a city
    canBuildCity(x, y) {
        if (this.citiesLeft === 0) {
            throw "4 cities already build";
        }
        if (!doesArrayContain(this.resources, buildingCosts.city)) {
            throw "Not enough resources";
        }
        if (this.cities.includes({ x: x, y: y })) {
            throw "City already built";
        }
        return true;
    }

    // Adds a new settlement to the player
    buildSettelment(x, y, shouldTakeResources) {
        this.settlements.push({ x: x, y: y });
        if (shouldTakeResources) {
            this.removeResources(buildingCosts.settlement);
        }
        this.settlementsLeft--;
        this.addPoints(1);
    }

    // Validates if the player can build a new settlement
    canBuildSettlement(x, y, shouldTakeResources) {
        if (this.settlementsLeft < 0) {
            throw "5 settlements already built";
        }
        if (!doesArrayContain(this.resources, buildingCosts.settlement) && shouldTakeResources) {
            throw "Not enough resources";
        }
        if (this.settlements.includes({ x: x, y: y })) {
            throw "Settelment already built";
        }
        return true;
    }

    // Adds a new road to the player
    buildRoad(startX, startY, endX, endY, shouldTakeResources) {
        this.roads.push({ startX: startX, startY: startY, endX: endX, endY: endY });
        if (shouldTakeResources) {
            this.removeResources(buildingCosts.road);
        }
        this.roadsLeft--;
    }

    // Validates if the player can build a new road
    canBuildRoad(startX, startY, endX, endY, shouldTakeResources) {
        if (this.roadsLeft < 0) {
            throw "15 roads already built";
        }
        if (!doesArrayContain(this.resources, buildingCosts.road) && shouldTakeResources) {
            throw "Not enough resources";
        }
        if (this.roads.includes({ startX: startX, startY: startY, endX: endX, endY: endY })) {
            throw "Road already built";
        }
        return true;
    }

    // Adds a new development card to the player and adds a point if the new card is a victory point
    buyDevCard(devCardObj) {
        this.playerDevCards.push(devCardObj);
        this.removeResources(buildingCosts.devCard);
        if (devCardObj.name === devCards.victoryPoint.name) {
            this.addPoints(1);
        }
    }

    // Validates if the player can buy a new development card
    canBuyDevCard() {
        if (!doesArrayContain(this.resources, buildingCosts.devCard)) {
            throw "Not enough resources";
        }
        return true;
    }
}

module.exports = Player;