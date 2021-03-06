const Tile = require("./tile");
const { resourcesTypes, pieceTypes } = require("../utils/constants");

const mockTile = new Tile(resourcesTypes.WOOD, 5, 0, 0, 70);

describe("Construction testing", () => {

    test("Coordinates calculation", () => {
        const expectedCoords = {
            top: { x: 181.86533479473212, y: 140 },
            topLeft: { x: 121.2435565298214, y: 105 },
            topRight: { x: 242.48711305964284, y: 105 },
            bottom: { x: 181.86533479473212, y: 0 },
            bottomLeft: { x: 121.2435565298214, y: 35 },
            bottomRight: { x: 242.48711305964284, y: 35 },
        }
        expect(mockTile.coordinates).toStrictEqual(expectedCoords);
    })
})