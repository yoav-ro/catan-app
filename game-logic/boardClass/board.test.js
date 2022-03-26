const Board = require("./board");
const { resourcesTypes, resourcesArr, numbersArr, pieceTypes } = require("../utils/constants");
const { doesArrayContain } = require("../utils/helperFunctions");


describe("Construction testing", () => {
    const mockBoard = new Board(70);

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

    test("Board includes the correct amount of each resource and numbers", () => {
        const resourcesOnBoard = [];
        const numbersOnBoard = [];
        mockBoard.tiles.forEach(tile => {
            resourcesOnBoard.push(tile.resource);
            numbersOnBoard.push(tile.number);
        })
        expect(doesArrayContain(resourcesOnBoard, resourcesArr)).toBe(true);
        expect(doesArrayContain(numbersArr, numbersOnBoard)).toBe(true);
    })
})

describe("Robber tests", () => {
    test("Moving to the same place throws an error", () => {
        const mockBoard = new Board(70);
        let oldRow, oldCell;
        mockBoard.tiles.forEach(tile => {
            if (tile.resource === resourcesTypes.DESERT) {
                oldCell = tile.cell;
                oldRow = tile.row;
            }
        })
        const move = () => {
            mockBoard.moveRobber(oldRow, oldCell);
        }
        expect(move).toThrow();
    })

    test("Moving to a new location", () => {
        const mockBoard = new Board(70);
        let oldRow, oldCell;
        mockBoard.tiles.forEach(tile => {
            if (tile.resource === resourcesTypes.DESERT) {
                oldCell = tile.cell;
                oldRow = tile.row;
            }
        })
        let newRow = 3;
        let newCell = 1;
        mockBoard.moveRobber(newRow, newCell);
        if (newRow !== oldRow && newCell !== newCell) {
            mockBoard.tiles.forEach(tile => {
                if (tile.resource === resourcesTypes.DESERT) {
                    expect(tile.isRobber).toBe(false);
                }
                if (tile.cell === newCell && tile.row === newRow) {
                    expect(tile.isRobber).toBe(true);
                }
            })
        }
    })
})

describe("Roads tests", () => {
    test("Road placement", () => {
        const mockBoard = new Board(70);
        mockBoard.addJunction("blue", 181.86533479473212, 0, pieceTypes.SETTELMENT, false);

        const roadInvalidCoords = () => {
            mockBoard.addRoad("blue", 1, 1, 2, 2);
        }
        expect(roadInvalidCoords).toThrow("Invalid road");

        const roadOnExistingRoad = () => {
            mockBoard.addRoad("blue", 181.86533479473212, 0, 121.2435565298214, 35);
            mockBoard.addRoad("blue", 181.86533479473212, 0, 121.2435565298214, 35);
        }
        expect(roadOnExistingRoad).toThrow("Road already accupied");

        const roadNotConnected = () => {
            mockBoard.addRoad("blue", 606.2177826491071, 315, 606.2177826491071, 245);
        }
        expect(roadNotConnected).toThrow("Cant place road here");

        const notBySamePlayer = () => {
            mockBoard.addRoad("red", 242.48711305964284, 35, 181.86533479473212, 0);
        }
        expect(notBySamePlayer).toThrow("Cant place road here");
    })
})
