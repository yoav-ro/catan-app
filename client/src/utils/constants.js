export const resourcesTypes = {
    WOOD: {
        name: "wood",
        ref: "http://catan-map.surge.sh/static/media/brick.90e15df7.png",
        color: "#255928",
    },
    BRICK: {
        name: "brick",
        ref: "http://catan-map.surge.sh/static/media/brick.90e15df7.png",
        color: "brown",
    },
    WHEAT: {
        name: "wheat",
        ref: "http://catan-map.surge.sh/static/media/brick.90e15df7.png",
        color: "#dbe36b",
    },
    SHEEP: {
        name: "sheep",
        ref: "http://catan-map.surge.sh/static/media/brick.90e15df7.png",
        color: "#b8f2bc"
    },
    IRON: {
        name: "iron",
        ref: "http://catan-map.surge.sh/static/media/brick.90e15df7.png",
        color: "#949995",
    },
    DESERT: {
        name: "desert",
        ref: "http://catan-map.surge.sh/static/media/brick.90e15df7.png",
        color: "#f2eeb8",
    },
}

export const numbersArr = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

export const resourcesArr = [
    resourcesTypes.BRICK, resourcesTypes.BRICK, resourcesTypes.BRICK,
    resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD,
    resourcesTypes.IRON, resourcesTypes.IRON, resourcesTypes.IRON,
    resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP,
    resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT,
    resourcesTypes.DESERT,
]

export const modalTypes={
    buildSettelment: "buildSettelmet",
    buildCity: "buildCity",
    buildRoad: "buildRoad",
}