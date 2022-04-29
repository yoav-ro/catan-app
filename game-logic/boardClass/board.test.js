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
        let oldRow;
        let oldCell;
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
            mockBoard.canPlaceRoad("blue", 1, 1, 2, 2)
            mockBoard.addRoad("blue", 1, 1, 2, 2);
        }
        expect(roadInvalidCoords).toThrow("Invalid road");

        const roadOnExistingRoad = () => {
            mockBoard.canPlaceRoad("blue", 181.86533479473212, 0, 121.2435565298214, 35);
            mockBoard.addRoad("blue", 181.86533479473212, 0, 121.2435565298214, 35);
            mockBoard.canPlaceRoad("blue", 181.86533479473212, 0, 121.2435565298214, 35);
        }
        expect(roadOnExistingRoad).toThrow("Road already accupied");

        const roadNotConnected = () => {
            mockBoard.canPlaceRoad("blue", 606.2177826491071, 315, 606.2177826491071, 245)
            mockBoard.addRoad("blue", 606.2177826491071, 315, 606.2177826491071, 245);
        }
        expect(roadNotConnected).toThrow("Cant place road here");

        const notBySamePlayer = () => {
            mockBoard.canPlaceRoad("red", 242.48711305964284, 35, 181.86533479473212, 0);
            mockBoard.addRoad("red", 242.48711305964284, 35, 181.86533479473212, 0);
        }
        expect(notBySamePlayer).toThrow("Cant place road here");
    })
})

describe("Longest road tests", () => {
    test("A chain of same- uninterrupted roads will be the longest road", () => {
        const mockBoard = new Board(70);
        mockBoard.addJunction("blue", 303.10889132455355, 0, pieceTypes.SETTELMENT, false);
        mockBoard.addRoad("blue", 363.73066958946424, 35, 303.10889132455355, 0);
        mockBoard.addRoad("blue", 363.7306695894643, 35, 363.7306695894643, 105);
        mockBoard.addRoad("blue", 363.73066958946424, 105, 303.10889132455355, 140);
        mockBoard.addRoad("blue", 303.10889132455355, 140, 303.10889132455355, 210);
        const longestRoad = mockBoard.longestRoad;
        expect(longestRoad.length).toBe(4);
    })

    test("Two rival roads", () => {
        const mockBoard = new Board(70);
        mockBoard.addJunction("blue", 303.10889132455355, 0, pieceTypes.SETTELMENT, false);
        mockBoard.addJunction("red", 424.35244785437493, 210, pieceTypes.SETTELMENT, false);
        mockBoard.addRoad("blue", 363.73066958946424, 35, 303.10889132455355, 0); //1b
        mockBoard.addRoad("blue", 363.7306695894643, 35, 363.7306695894643, 105); //2b
        mockBoard.addRoad("blue", 363.73066958946424, 105, 303.10889132455355, 140); //3b
        mockBoard.addRoad("red", 424.35244785437493, 210, 363.73066958946424, 245);//1r
        mockBoard.addRoad("red", 363.73066958946424, 245, 303.10889132455355, 210)//2r
        mockBoard.addRoad("red", 303.10889132455355, 210, 242.48711305964284, 245); //3r
        mockBoard.addRoad("red", 242.48711305964284, 245, 242.48711305964284, 315);//4r
        mockBoard.addRoad("red", 424.35244785437493, 140, 424.35244785437493, 210);//5r
        mockBoard.addRoad("blue", 303.10889132455355, 140, 303.10889132455355, 210);//4b
        const longestRoad = mockBoard.longestRoad;
        expect(longestRoad.length).toBe(5);
    })

    test("Cutting a road", () => {
        const mockBoard = new Board(70);
        mockBoard.addJunction("blue", 303.10889132455355, 0, pieceTypes.SETTELMENT, false);
        mockBoard.addJunction("red", 424.35244785437493, 210, pieceTypes.SETTELMENT, false);

        mockBoard.addRoad("blue", 363.73066958946424, 35, 303.10889132455355, 0); //1b
        mockBoard.addRoad("blue", 363.7306695894643, 35, 363.7306695894643, 105); //2b
        mockBoard.addRoad("blue", 363.73066958946424, 105, 303.10889132455355, 140); //3b
        mockBoard.addRoad("blue", 303.10889132455355, 140, 303.10889132455355, 210);//4b
        mockBoard.addRoad("blue", 303.10889132455355, 210, 242.48711305964284, 245);//5b
        mockBoard.addRoad("blue", 242.48711305964284, 245, 242.48711305964284, 315);//6b

        mockBoard.addRoad("red", 424.35244785437493, 210, 363.73066958946424, 245);//1r
        mockBoard.addRoad("red", 363.73066958946424, 245, 303.10889132455355, 210)//2r
        mockBoard.addJunction("red", 303.10889132455355, 210, pieceTypes.SETTELMENT, false);
        mockBoard.addRoad("red", 424.35244785437493, 140, 424.35244785437493, 210);//3r
        mockBoard.addRoad("red", 484.9742261192856, 105, 424.35244785437493, 140);//4r
        mockBoard.addRoad("red", 545.5960043841964, 140, 484.9742261192856, 105);//5r
        const longestRoad = mockBoard.longestRoad;
        expect(longestRoad.length).toBe(5);
        expect(longestRoad[0].player).toBe("red");
    })

    test("Road loop", () => {
        const mockBoard = new Board(70);
        mockBoard.addJunction("blue", 303.10889132455355, 0, pieceTypes.SETTELMENT, false);

        mockBoard.addRoad("blue", 363.73066958946424, 35, 303.10889132455355, 0); //1b
        mockBoard.addRoad("blue", 363.7306695894643, 35, 363.7306695894643, 105); //2b
        mockBoard.addRoad("blue", 363.73066958946424, 105, 303.10889132455355, 140); //3b
        mockBoard.addRoad("blue", 303.10889132455355, 140, 242.48711305964284, 105);//4b
        mockBoard.addRoad("blue", 242.48711305964284, 35, 242.48711305964284, 105);//5b
        mockBoard.addRoad("blue", 303.10889132455355, 0, 242.48711305964284, 35);//6b
        mockBoard.addRoad("blue", 303.10889132455355, 140, 303.10889132455355, 210);//7b

        const longestRoad = mockBoard.longestRoad;
        expect(longestRoad.length).toBe(7);
    })
})