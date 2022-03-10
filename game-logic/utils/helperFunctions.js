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
    return items.every(item => { array.includes(item) })
}

module.exports = {
    mixArray, getDistance, doesArrayContain
}