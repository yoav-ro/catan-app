const { dicesRoll } = require("./utils/helperFunctions");
const { pieceTypes } = require("./utils/constants");
const Player = require("./player");
const Board = require("./board");

class Game {
    constructor(playersDataArr, tileRadius) {
        this.board = new Board(tileRadius);
        this.players = [
            new Player(playersDataArr[0].name, playersDataArr[0].color),
            new Player(pplayersDataArr[1].name, playersDataArr[1].color),
            new Player(playersDataArr[2].name, playersDataArr[2].color),
            new Player(playersDataArr[3].name, playersDataArr[3].color)];
        this.currTurn = undefined;
        this.isSetupPhase = true;
    }

    //Give player their resources by roll
    rollDice(player) {
        if (player.color = this.currTurn) {
            const roll = dicesRoll();
            this.board.tiles.forEach(tile => {
                if (tile.number === roll) {
                    const resourceToGive = tile.resource;
                    for (let junction of surroundingJunctions) {
                        const player = this.#getPlayerByColor(junction.player);
                        if (junction.type === pieceTypes.CITY) {
                            player.addResources([resourceToGive, resourceToGive]);
                        }
                        if (junction.type === pieceTypes.SETTELMENT) {
                            player.addResources([resourceToGive]);
                        }
                    }
                }
            });
        }
    }

    #getPlayerByColor(color) {
        this.players.forEach(player => {
            if (player.color === color) {
                return player;
            }
        })
    }
}