const { pieceTypes } = require("../utils/constants");

class Junction {
    constructor(x, y, port) {
        this.x === x;
        this.y === y;
        this.player = undefined;
        this.pieceType = undefined;
        this.port = port;
    }

    setJunction(player, newPieceType) {
        if (this.player) { //Junction is taken
            if (player !== this.player) {
                throw "Junction is already taken by " + this.player;
            }
            if (this.pieceType === newPieceType) {
                throw `Junction at (${this.x}, ${this.y}) is already a ${newPieceType}`;
            }
            this.pieceType = newPieceType;
        }
        else {//junction is free
            if (newPieceType === pieceTypes.CITY) {
                throw "Cant build a city at an empty junction";
            }
            this.player = player;
            this.pieceType = newPieceType;
        }
    }

    getStatus() {
        if (!this.player) {
            return "free";
        }
        return {
            player: this.player,
            type: this.pieceType,
        }
    }
}

module.exports = Junction;