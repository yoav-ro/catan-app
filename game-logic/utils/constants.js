const resourcesTypes = {
    WOOD: "wood",
    BRICK: "brick",
    WHEAT: "wheat",
    SHEEP: "sheep",
    IRON: "iron",
    DESERT: "desert",
}

const playerColors = {
    BLUE: "blue",
    RED: "red",
    WHITE: "white",
    ORANGE: "orange",
}

const pieceTypes = {
    CITY: "city",
    SETTELMENT: "settelment",
    ROAD: "road",
    DEVCARD: "devCard",
}
const buildingCosts = {
    settelment: [resourcesTypes.BRICK, resourcesTypes.WOOD, resourcesTypes.SHEEP, resourcesTypes.WHEAT],
    road: [resourcesTypes.WOOD, resourcesTypes.BRICK],
    devCard: [resourcesTypes.IRON, resourcesTypes.SHEEP, resourcesTypes.WHEAT],
    city: [resourcesTypes.IRON, resourcesTypes.IRON, resourcesTypes.IRON, resourcesTypes.WHEAT, resourcesTypes.WHEAT]
}

const numbersArr = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

const resourcesArr = [
    resourcesTypes.BRICK, resourcesTypes.BRICK, resourcesTypes.BRICK,
    resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.WOOD,
    resourcesTypes.IRON, resourcesTypes.IRON, resourcesTypes.IRON,
    resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP, resourcesTypes.SHEEP,
    resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.WHEAT,
    resourcesTypes.DESERT,
];

const portsArr = [
    resourcesTypes.WHEAT, resourcesTypes.WHEAT, resourcesTypes.BRICK, resourcesTypes.BRICK, resourcesTypes.IRON, resourcesTypes.IRON,
    resourcesTypes.WOOD, resourcesTypes.WOOD, resourcesTypes.SHEEP, resourcesTypes.SHEEP, "3to1", "3to1", "3to1", "3to1",
]

const devCards = {
    knight: {
        name: "Knight",
        description: "Allows you to move the robber and place it onto a new hex, and steal a random card from an opponent with settlements or cities adjacent to it",
        canPlayBeforeRoll: true,
        canUseInstantly: false,
        isUsed: false,
    },
    roadBuilding: {
        name: "Road Building",
        description: "Player can place 2 roads as if they just built them",
        canPlayBeforeRoll: false,
        canUseInstantly: false,
        isUsed: false,
    },
    yearOfPlenty: {
        name: "Year of Plenty",
        description: "The player can draw 2 resource cards of their choice from the bank",
        canPlayBeforeRoll: false,
        canUseInstantly: true,
        isUsed: false,
    },
    monopoly: {
        name: "Monopoly",
        description: "The player can claim all resource cards of a specific declared type",
        canPlayBeforeRoll: false,
        canUseInstantly: false,
        isUsed: false,
    },
    victoryPoint: {
        name: "Victory Point",
        description: " 1 additional Victory Point is added to the owners total and doesn't need to be played to win.",
        canPlayBeforeRoll: false,
        canUseInstantly: false,
        isUsed: true,
    }
}

//Each game contains: 14 knight, 5 victory points, 2 road building, 2 years of plenty, 2 monopoly.
const devCardsArr = [
    devCards.knight, devCards.knight, devCards.knight, devCards.knight, devCards.knight, devCards.knight, devCards.knight,
    devCards.knight, devCards.knight, devCards.knight, devCards.knight, devCards.knight, devCards.knight, devCards.knight,
    devCards.victoryPoint, devCards.victoryPoint, devCards.victoryPoint, devCards.victoryPoint, devCards.victoryPoint,
    devCards.roadBuilding, devCards.roadBuilding,
    devCards.yearOfPlenty, devCards.yearOfPlenty,
    devCards.monopoly, devCards.monopoly,
]



module.exports = {
    resourcesArr, numbersArr, resourcesTypes, playerColors, buildingCosts, devCards, devCardsArr, pieceTypes, portsArr
}