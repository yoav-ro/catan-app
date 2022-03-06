import { resources } from "./constants";

export function getRowsData() {
    const resourcesArr = [
        resources.BRICK, resources.BRICK, resources.BRICK,
        resources.WOOD, resources.WOOD, resources.WOOD, resources.WOOD,
        resources.IRON, resources.IRON, resources.IRON,
        resources.SHEEP, resources.SHEEP, resources.SHEEP, resources.SHEEP,
        resources.WHEAT, resources.WHEAT, resources.WHEAT, resources.WHEAT,
        resources.DESERT,
    ]
    for (let i = resourcesArr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [resourcesArr[i], resourcesArr[j]] = [resourcesArr[j], resourcesArr[i]];
    }

    const row0 = [resourcesArr[0], resourcesArr[1], resourcesArr[2]]
    const row1 = [resourcesArr[3], resourcesArr[4], resourcesArr[5], resourcesArr[6]]
    const row2 = [resourcesArr[7], resourcesArr[8], resourcesArr[9], resourcesArr[10], resourcesArr[11]]
    const row3 = [resourcesArr[12], resourcesArr[13], resourcesArr[14], resourcesArr[15]]
    const row4 = [resourcesArr[16], resourcesArr[17], resourcesArr[18]]

    return {
        row0: row0, row1: row1, row2: row2, row3: row3, row4: row4
    };
}



export function getResourceBackground(resource) {
    switch (resource) {
        case resource === resources.BRICK:
            return "brown"
        case resource === resources.DESERT:
            return "#f2eeb8"
        case resource === resources.SHEEP:
            return "#b8f2bc"
        case resource === resources.IRON:
            return "#949995"
        case resource === resources.WOOD:
            return "#255928"
        case resource === resources.WHEAT:
            return "#dbe36b"
        default:
            break;
    }
}

