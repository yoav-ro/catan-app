const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { nanoid } = require("nanoid");
const CatanGame = require("../game-logic/catanManager/CatanManager");
const cors = require("cors");
const { eventDirectivesArr, activeEventDirectivesArr, passiveEventDirectivesArr, eventTypes, directiveTypes } = require("./constants");
const { activeEventObjCreator, passiveEventObjCreator, createResourceDropEventObj, createVictoryEventObj } = require("./helperFunctions");

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

    socket.on("joinGame", async ({ username }) => {
        if (playersQueue.some((player) => player.username === username)) { // Validate user name
            io.to(socket.id).emit("lobby", "User name already taken");
        }
        else {
            playersQueue.push({ username: username, id: socket.id }); // Add to queue
            io.to(socket.id).emit("lobby",
                {
                    msg: `Joined queue. Looking for ${gamePlayerCap - playersQueue.length} players`,
                    queue: playersQueue,
                }
            );
        }

        if (playersQueue.length === gamePlayerCap) { // Create a new game when cap is filled
            const gameObj = gameCreator(playersQueue);
            const gameId = gameObj.id;
            const chatId = "chat" + gameId.slice(4, gameId.length);
            const connectedSockets = await io.fetchSockets();
            for (let connectedSocket of connectedSockets) {
                connectedSocket.join(gameId);
                connectedSocket.join(chatId);
            }
            playersQueue.length = 0;
            games.push(gameObj);
            io.to(gameId).emit("game-data", gameObj);
            io.to(chatId).emit("chat-data", {
                chatId: chatId,
                type: "server",
                content: "Game starting!",
            });
        }
    })

    socket.on("msgToServer", ({ messageObj }) => { // Emit chat messages
        io.to(messageObj.chatId).emit("chat-data", messageObj);
    })

    socket.on("newDirective", ({ directive }) => { // Handle incoming directive
        const fullGameData = findGameBySocketId(socket.id);

        const directiveOutput = fullGameData.game.sendDirective(directive);
        const objToEmit = {
            id: fullGameData.id,
            game: directiveOutput.gameData,
            message: directiveOutput.message,
            players: fullGameData.players,
        }
        if (fullGameData) {
            if (objToEmit.message.error) {
                io.to(socket.id).emit("game-error", objToEmit.message.error)
            }
            else {
                io.to(fullGameData.id).emit("game-data", objToEmit);

                const chatId = "chat" + objToEmit.id.slice(4, objToEmit.id.length);
                for (let message of objToEmit.message) {
                    io.to(chatId).emit("chat-data", generateServerMsg(message, chatId));
                }

                if (activeEventDirectivesArr.includes(directive.type)) {
                    const eventObj = activeEventObjCreator(directive, fullGameData.game);
                    io.to(fullGameData.id).emit("game-event", eventObj);
                }
                if (objToEmit.game.directiveExpectation.includes(directiveTypes.dropResources)) {
                    const eventObj = createResourceDropEventObj(objToEmit.game);
                    io.to(fullGameData.id).emit("game-event", eventObj);
                }
                if (objToEmit.game.winner) {
                    const eventObj = createVictoryEventObj(objToEmit.game.winner);
                    io.to(fullGameData.id).emit("game-event", eventObj);
                }
            }
        }
    })

    socket.on("leaveQueue", ({ username }) => { // Leaving queue
        if (removeFromQueue(username)) {
            io.to(socket.id).emit("lobby", { msg: `Player "${username}" has left the lobby` });
        }
    })

    socket.on("disconnect", (reason) => { // Handle user disconnecting
        const username = findUserNameBySocketId(socket.id);
        if (removeFromQueue(username)) {
            io.to(socket.id).emit("lobby", { msg: `Player "${username}" has left the lobby` });
        }
        // todo- find the game disconnected from and end it end game
    })
})

function removeFromQueue(userName) {
    const playerIndex = playersQueue.findIndex(user => user.username === userName);
    if (playerIndex !== -1) {
        playersQueue.splice(playerIndex, 1);
        return true;
    }
    return false;
}

function findUserNameBySocketId(socketId) {
    let ret;
    playersQueue.forEach(user => {
        if (user.id === socketId) {
            ret = user.username;
        }
    })
    return ret;
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

function generateServerMsg(gameMessage, chatId) {
    return {
        chatId: chatId,
        type: "server",
        content: gameMessage,
    }
}
