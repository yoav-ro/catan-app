function mixArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
}

function doesArrayContain(array, items) {
    for (let item of items) {
        if (!array.includes(item)) {
            return false;
        }
    }
    return true;
}

function dicesRoll() {
    const dice1 = Math.round(Math.random() * (6 - 1) + 1);
    const dice2 = Math.round(Math.random() * (6 - 1) + 1);
    return { dice1: dice1, dice2: dice2 };
    // return { dice1: 5, dice2: 2 };

}

function countItemsInArray(array, itemToCount) {
    return array.filter(item => item === itemToCount).length;
}

function randomItemFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function roundBySecondDec(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

module.exports = {
    mixArray, getDistance, doesArrayContain, dicesRoll, countItemsInArray, randomItemFromArray, roundBySecondDec
}