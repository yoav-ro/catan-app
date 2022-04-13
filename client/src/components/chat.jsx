import React from "react";
import "./styles/playerDeck.css";

function Chat({ gameData }) {
    const currTurn = gameData.playerOrder[0];
    return (
        <div className="chat">
            <span>
                <h4>Turn:
                    <div className="playerHeader" style={{ color: currTurn.color }}>{currTurn.name.username}</div>
                </h4>
            </span>
        </div>
    )
}

export default Chat;