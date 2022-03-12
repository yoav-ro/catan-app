const { dicesRoll } = require("./utils/helperFunctions");
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

    rollDice(player) {
        if (player.color = this.currTurn) {
            const roll = dicesRoll();
            this.board.tiles.forEach(tile => {
                if (tile.number === roll){

                }
            });
        }
    }
}