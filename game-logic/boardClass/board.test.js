const Board = require("./board");
const { resourcesTypes, resourcesArr } = require("../utils/constants");
const { doesArrayContain } = require("../utils/helperFunctions");

const mockBoard = new Board(70);

describe("Construction testing", () => {

    test("No initial roads", () => {
        expect(
            mockBoard.roads.length
        ).toBe(0)

    })

    test("No initial longest road", () => {
        expect(
            mockBoard.longestRoad.length
        ).toBe(0)
    })

    test("Robber should only be on the desert", () => {
        mockBoard.tiles.forEach(tile => {
            if (tile.resource === resourcesTypes.DESERT) {
                expect(tile.isRobber).toBe(true);
            }
            else {
                expect(tile.isRobber).toBe(false);
            }
        })
    })

    test("Board includes the correct amount of each resource", () => {
        const resourcesOnBoard = [];
        mockBoard.tiles.forEach(tile => {
            resourcesOnBoard.push(tile.resource);
        })
        console.log(resourcesOnBoard.length, resourcesArr.length)
        expect(doesArrayContain(resourcesOnBoard, resourcesArr)).toBe(true);
    })
})

