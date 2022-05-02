const { buildingCosts, devCards, pieceTypes } = require("../utils/constants");
const { doesArrayContain, countItemsInArray } = require("../utils/helperFunctions")

class Player {
    constructor(name, color) {
        this.playerName = name;
        this.color = color;
        this.points = 0;
        this.citiesLeft = 4;
        this.settelmentsLeft = 5;
        this.roadsLeft = 15;
        this.resources = [];
        this.settelments = [];
        this.cities = [];
        this.roads = [];
        this.devCards = [];
        this.activeKnights = 0;
    }

    addResources(resourcesToAddArr) {
        this.resources = this.resources.concat(resourcesToAddArr);
    }

    activateDevCard(devCardType) {
        let doesPlayerHaveCard = false;
        this.devCards.forEach(devCard => {
            if (devCard.name === devCardType && !devCard.isUsed) {
                doesPlayerHaveCard = true;
                devCard.isUsed = true;
            }
            else {
                throw "Development card already used"
            }
        })
        if (!doesPlayerHaveCard) {
            throw "Player doesnt have this card (" + devCardType + ")"
        }
    }

    countResources(resourceType) {
        return countItemsInArray(this.resources, resourceType);
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
                this.addPoints(2);
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