const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const nanoid = require("nanoid");
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

        if (playersQueue.length === 4) {
            const gameObj = gameCreator(playersQueue[0], playersQueue[1], playersQueue[2], playersQueue[3]);
            games.push(gameObj);
        }
    })

    socket.on("newDirective", ({ directive }) => {
        const game = games.find((game) => {
            game.some((player) => { player.id === socket.id });
        })
        game.sendDirective(directive);
        
        game.player.forEach(player => {
            socket.to(player.id).emit(game);
        });
    })

    socket.on("disconnect", (reason) => {
        console.log(`Connection with id ${socket.id} has disconnected (${reason})`);
        //should end game
    })
})


function gameCreator(playersArray) {
    const colorBank = ["red", "orange", "white", "blue"];

    for (let i = colorBank.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [colorBank[i], colorBank[j]] = [colorBank[j], colorBank[i]];
    }

    const playersObj = [
        {
            name: playersArray[0],
            color: colorBank[0],
        },
        {
            name: playersArray[1],
            color: colorBank[1],
        },
        {
            name: playersArray[2],
            color: colorBank[2],
        },
        {
            name: playersArray[3],
            color: colorBank[3],
        },
    ]

    const game = new CatanGame(playersObj, 70);
    return {
        id: "game" + nanoid(),
        game: game,
        players: playersArray,
    };
}

