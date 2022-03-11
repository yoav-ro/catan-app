const { resourcesTypes, buildingCosts } = require("./utils/constants");
const { doesArrayContain } = require("./utils/helperFunctions")

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
        try {
            if (this.#canBuildCity(x, y)) {
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
        } catch (error) {
            return { message: "Error: " + error };
        }

    }

    #canBuildCity(x, y) {
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

    buildSettelment(x, y) {
        try {
            if (this.#canBuildSettlement(x, y)) {
                this.settelments.push({ x: x, y: y });
                this.removeResources(buildingCosts.settelment);
                this.settelmentsLeft--;
                this.addPoints(1);
            }
        } catch (error) {
            return { message: "Error: " + error };
        }
    }

    #canBuildSettlement(x, y) {
        if (this.settelmentsLeft < 0) {
            throw "5 settelments already built";
        }
        if (!doesArrayContain(this.resources, buildingCosts.settelment)) {
            throw "Not enough resources";
        }
        if (this.settelments.includes({ x: x, y: y })) {
            throw "Settelment already built";
        }
        return true;
    }

    buildRoad(startX, startY, endX, endY) {
        try {
            if (this.#canBuildRoad(startX, startY, endX, endY)) {
                this.roads.push({ startX: startX, startY: startY, endX: endX, endY: endY });
                this.removeResources(buildingCosts.road);
                this.roadsLeft--;
            }
        } catch (error) {
            return { message: "Error: " + error };
        }
    }

    #canBuildRoad(startX, startY, endX, endY) {
        if (this.roadsLeft < 0) {
            throw "15 roads already built";
        }
        if (!doesArrayContain(this.resources, buildingCosts.road)) {
            throw "Not enough resources";
        }
        if (this.roadsLeft.includes({ startX: startX, startY: startY, endX: endX, endY: endY })) {
            throw "Road already built";
        }
        return true;
    }

    buyDevCard(devCardObj) {

    }
}