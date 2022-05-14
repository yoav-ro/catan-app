const Player = require("./player");

const mockPlayer = new Player("yoav", "blue");

describe("Building tests", () => {

    test("Building a road", () => {

        const addRoadNoRes = () => {
            const mockRoadObj = {
                startX: 1,
                startY: 1,
                endX: 2,
                endY: 2,
                shouldTakeResources: true,
            }
            const { startX, startY, endX, endY, shouldTakeResources } = mockRoadObj;
            mockPlayer.canBuildRoad(startX, startY, endX, endY, shouldTakeResources);
        }
        expect(addRoadNoRes).toThrow("Not enough resources");
    })
})