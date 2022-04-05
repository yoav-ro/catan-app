import { resourcesTypes, numbersArr, resourcesArr } from "./constants";

export function getRowsData() {
    for (let i = resourcesArr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [resourcesArr[i], resourcesArr[j]] = [resourcesArr[j], resourcesArr[i]];
    }
    for (let i = numbersArr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [numbersArr[i], numbersArr[j]] = [numbersArr[j], numbersArr[i]];
    }

    const tilesData = resourcesArr.map(tile => {
        if (tile.name === resourcesTypes.DESERT.name) {
            return { resource: tile, number: undefined };
        } else {
            return{ resource: tile, number: numbersArr.pop() }
        }
    });

    console.log(tilesData.length, tilesData)
    const row0 = [tilesData[0], tilesData[1], tilesData[2]]
    const row1 = [tilesData[3], tilesData[4], tilesData[5], tilesData[6]]
    const row2 = [tilesData[7], tilesData[8], tilesData[9], tilesData[10], tilesData[11]]
    const row3 = [tilesData[12], tilesData[13], tilesData[14], tilesData[15]]
    const row4 = [tilesData[16], tilesData[17], tilesData[18]]

    return {
        row0: row0, row1: row1, row2: row2, row3: row3, row4: row4
    };
}

