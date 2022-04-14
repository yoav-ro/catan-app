const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { nanoid } = require("nanoid");
const CatanGame = require("../game-logic/catanAPI/catanAPI");
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const games = [];
const playersQueue = [];

io.sockets.on("connection", (socket) => {
    console.log(`Connection with id ${socket.id}`);
    const gamePlayerCap = 4;

    socket.on("joinGame", ({ username }) => {
        if (playersQueue.some((player) => player.username === username)) {
            io.to(socket.id).emit("lobby", "User name already taken");
        }
        else {
            playersQueue.push({ username: username, id: socket.id });
            io.to(socket.id).emit("lobby",
                {
                    msg: `Joined queue. Looking for ${gamePlayerCap - playersQueue.length} players`,
                    queue: playersQueue,
                }
            );
        }

        if (playersQueue.length === gamePlayerCap) {
            const gameObj = gameCreator(playersQueue);
            playersQueue.length = 0;
            games.push(gameObj);
            emitToPlayers(io, gameObj);
        }
    })

    socket.on("newDirective", ({ directive }) => {
        const game = findGameBySocketId(socket.id);

        console.log(directive)

        const directiveOutput = game.game.sendDirective(directive);
        const objToEmit = {
            id: game.id,
            game: directiveOutput.gameData,
            message: directiveOutput.message,
            expectation: game.directiveExpectation,
            players: game.players,
        }

        if (game) {
            game.players.forEach(player => {
                console.log(`sending to ${player.name}(${player.id})`)
                io.to(player.id).emit("game-data", objToEmit);
            });
        }

        emitToPlayers(io, game);

        socket.on("leaveQueue", ({ username }) => {
            const playerIndex = playersQueue.findIndex(user => user.username === username);
            if (playerIndex !== -1) {
                playersQueue.splice(playerIndex, 1);
                io.to(socket.id).emit("lobby", { msg: `Player "${username}" has left the lobby` });
            }
        })

        socket.on("disconnect", (reason) => {
            console.log(`Connection with id ${socket.id} has disconnected (${reason})`);
            //todo- find the game disconnected from and end it end game
        })
    })
})

function emitToPlayers(io, game) {
    game.players.forEach(player => {
        console.log(`sending to ${player.name}(${player.id})`)
        io.to(player.id).emit("game-data", game);
    });
}


function findGameBySocketId(socketId) {
    let ret;
    games.forEach(game => {
        if (game.players.some(player => player.id === socketId)) {
            ret = game;
        }
    })
    return ret;
}

function gameCreator(playersArray) {
    const colorBank = ["red", "orange", "white", "blue"];

    for (let i = colorBank.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [colorBank[i], colorBank[j]] = [colorBank[j], colorBank[i]];
    }

    const playersObj = []
    for (let i = 0; i < playersArray.length; i++) {
        playersObj.push({
            name: playersArray[i],
            color: colorBank[i],
        })
    }

    const game = new CatanGame(playersObj, 70);
    return {
        id: "game" + nanoid(),
        game: game,
        message: "New game created",
        expectation: game.directiveExpectation,
        players: playersArray.slice(),
    };
}
