const { resourcesTypes, buildingCosts } = require("./utils/constants");
const { doesArrayContain } = require("./utils/helperFunctions")

class Player {
    constructor(name, color) {
        this.playerName = name;
        this.citiesLeft = 4;
        this.settelmentsLeft = 5;
        this.roadsLeft = 15;
        this.resources = [];
        this.settelments = [];
        this.cities = [];
        this.color = color;
        this.points = 0;
        this.devCards = [];
        this.largestArmy = false;
        this.longestRoad = false;
    }

    addResources(resourcesToAddArr) {
        this.resources = [...this.resources, ...resourcesToAddArr];
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
        if (this.citiesLeft > 0) {
            if (doesArrayContain(this.resources, buildingCosts.city)) {
                if (this.cities.includes({ x: x, y: y })) {
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
                            break;
                        }
                    }
                }
                else {
                    throw "City already built";
                }
            }
            else {
                throw "Not enough resources";
            }
        }
        else {
            throw "4 cities already built";
        }
    }

    buildSettelments() {
        if (this.settelmentsLeft > 0) {
            if (doesArrayContain(this.resources, buildingCosts.settelment)) {
                if (!this.settelments.includes({ x: x, y: y })) {
                    this.settelments.push({ x: x, y: y });
                    this.removeResources(buildingCosts.city);
                    this.settelmentsLeft--;
                }
                else {
                    throw "Settelment already built";
                }
            }
            else {
                throw "Not enough resources";
            }
        }
        else {
            throw "5 settelment already build";
        }

    }

    buildRoad() {

    }

    buyDevCard() {

    }
}