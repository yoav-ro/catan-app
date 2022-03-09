const resourcesTypes = {
    WOOD: {
        name: "wood",
    },
    BRICK: {
        name: "brick",
    },
    WHEAT: {
        name: "wheat",
    },
    SHEEP: {
        name: "sheep",
    },
    IRON: {
        name: "iron",
    },
    DESERT: {
        name: "desert",
    },
}

const players = {
    BLUE: "blue",
    RED: "red",
    WHITE: "white",
    ORANGE: "orange",
}

const numbersArr = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

const resourcesArr = [
    resourcesTypes.BRICK, resourcesTypes.BRICK, resourcesTypes.BRICK,
    resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD,
    resourcesTypes.IRON, resourcesTypes.IRON, resourcesTypes.IRON,
    resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP,
    resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT,
    resourcesTypes.DESERT,
]

module.exports = {
    resourcesArr, numbersArr, resourcesTypes, players
}