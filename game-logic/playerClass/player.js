const { buildingCosts, devCards, pieceTypes, resourcesTypes } = require("../utils/constants");
const { doesArrayContain, countItemsInArray } = require("../utils/helperFunctions")

class Player {
    constructor(name, color) {
        this.playerName = name;
        this.color = color;
        this.points = 0;
        this.citiesLeft = 4;
        this.settelmentsLeft = 5;
        this.roadsLeft = 15;
        // this.resources = [];
        this.resources = [ //for easier testing
            resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD,
            resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT,
            resourcesTypes.BRICK, resourcesTypes.BRICK, resourcesTypes.BRICK, resourcesTypes.BRICK, resourcesTypes.BRICK, resourcesTypes.BRICK,
            resourcesTypes.IRON, resourcesTypes.IRON, resourcesTypes.IRON, resourcesTypes.IRON, resourcesTypes.IRON, resourcesTypes.IRON,
            resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP,
        ]
        this.settelments = [];
        this.cities = [];
        this.roads = [];
        this.devCards = [];
        this.activeKnights = 0;
    }

    addResources(resourcesToAddArr) {
        this.resources = this.resources.concat(resourcesToAddArr);
    }

    validateDevCard(devCardType) {
        let doesPlayerHaveCard = false;
        let doesPlayerHaveUnusedCard = false;
        let isCardUseAble = false;
        for (let card of this.devCards) {
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

    activateDevCard(devCardType) {
        console.log(devCardType, this.devCards)
        const card = this.devCards.find(card => card.name === devCardType);
        if (!card.isUsed) {
            card.isUsed = true;
        }
    }

    countResources(resourceType) {
        return countItemsInArray(this.resources, resourceType);
    }

    makeDevCardUseAble() {
        this.devCards.forEach(card => {
            card.isUseAble = true;
        })
    }

    removeResources(resourcesToRemoveArr) {
        if (doesArrayContain(this.resources, resourcesToRemoveArr)) {
            resourcesToRemoveArr.forEach(item => {
                const itemIndex = this.resources.indexOf(item);
                this.resources.splice(itemIndex, 1);
            });
        }
    }

    addPoints(pointsToAdd) {
        this.points += pointsToAdd;
    }

    removePoints(pointsToRemove) {
        if (pointsToRemove > this.points) {
            this.points = 0;
        }
        else {
            this.points -= pointsToRemove;
        }
    }

    buildCity(x, y) {
        for (let i = 0; i < this.settelments.length; i++) {
            if (this.settelments[i].x === x && this.settelments[i].y === y) {
                const cityObject = {
                    x: x,
                    y: y,
                }
                this.cities.push(cityObject);
                this.citiesLeft--;
                this.settelmentsLeft++;
                this.settelments.splice(i, 1);
                this.removeResources(buildingCosts.city);
                this.addPoints(1);
                break;
            }
        }
    }

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

    buildSettelment(x, y, shouldTakeResources) {
        this.settelments.push({ x: x, y: y });
        if (shouldTakeResources) {
            this.removeResources(buildingCosts.settelment);
        }
        this.settelmentsLeft--;
        this.addPoints(1);
    }

    canBuildSettlement(x, y, shouldTakeResources) {
        if (this.settelmentsLeft < 0) {
            throw "5 settelments already built";
        }
        if (!doesArrayContain(this.resources, buildingCosts.settelment) && shouldTakeResources) {
            throw "Not enough resources";
        }
        if (this.settelments.includes({ x: x, y: y })) {
            throw "Settelment already built";
        }
        return true;
    }

    buildRoad(startX, startY, endX, endY, shouldTakeResources) {
        this.roads.push({ startX: startX, startY: startY, endX: endX, endY: endY });
        if (shouldTakeResources) {
            this.removeResources(buildingCosts.road);
        }
        this.roadsLeft--;
    }

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

    buyDevCard(devCardObj) {
        this.devCards.push(devCardObj);
        this.removeResources(buildingCosts.devCard);
        if (this.devCards.name === devCards.victoryPoint.name) {
            this.points++;
        }
    }

    canBuyDevCard() {
        if (!doesArrayContain(this.resources, buildingCosts.devCard)) {
            throw "Not enough resources";
        }
        return true;
    }
}

module.exports = Player;