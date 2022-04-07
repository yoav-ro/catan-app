import React, { useState } from "react";
import { io } from "socket.io-client";

function JoinGameForm({ gameSocketRef }) {
    const [userName, setUserName] = useState("");

    const handleClick = (e) => {
        e.preventDefault();
        if (!userName) {
            alert("Invalid input!")
        } else {
            //joinsocket
            console.log("joining")
            gameSocketRef.current.emit("joinGame", { username: userName });
        }

    }

    const getGame = (e) => {
        gameSocketRef.current.emit("newDirective", { directive: "test" });
    }

    return (
        <div>
            <form>
                <input type="text" placeholder="Enter player name" onChange={(e) => setUserName(e.target.value)} />
                <button type="submit" onClick={handleClick}>Join</button>
            </form>
            <button onClick={getGame}>Get game</button>
        </div>
    )
}

export default JoinGameForm;