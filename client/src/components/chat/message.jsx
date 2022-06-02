import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../styles/playerDeck.css";
import "./chat.css";

function ChatMessage({ msgObj }) {
    const currPlayer = useSelector(state => state.playerReducer);

    const sender = msgObj.type === "server" ? "Server" : msgObj.player.username;
    const playerColor = msgObj.type === "server" ? "grey" : msgObj.player.color;
    const borderColorCorrection = playerColor === "white" ? "gray" : playerColor
    const content = msgObj.content;

    const styleObj = {
        borderLeft: currPlayer === sender ? "5px solid " + borderColorCorrection : "1px solid black",
        borderRight: currPlayer !== sender ? "5px solid " + borderColorCorrection : "1px solid black",
        textAlign: currPlayer === sender ? "left" : "right",
    }
    if (msgObj.type === "server") {
        styleObj.borderLeft = "5px solid #71a3f5";
        styleObj.borderRight = "5px solid #71a3f5";
        styleObj.textAlign = "center";
    }

    return (
        <Container className="bubble" style={styleObj}>
            <div className="playerHeader" style={{ color: playerColor }}>{sender}</div>
            <div>{content}</div>
        </Container>
    )
}

export default ChatMessage;