import React, { useRef, useState, useEffect } from "react";
import { Button, Container, InputGroup, FormControl, Form } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import "../styles/playerDeck.css";
import ChatMessage from "./message";
import TurnHeader from "./turnHeader";

function Chat({ gameData, gameSocketRef }) {
    const [chatInput, setChatInput] = useState("");
    const chat = useSelector(state => state.chatReducer);
    const currUser = useSelector(state => state.playerReducer);
    const players = gameData.players;
    const player = players.find(player => player.playerName.username === currUser);

    const bottomRef = useRef(null);

    const { chatId, messages } = chat;

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleClick = (e) => {
        e.preventDefault();
        if (chatInput !== "") {
            const messageObj = {
                type: "player",
                chatId: chatId,
                player: {
                    username: currUser,
                    color: player.color,
                },
                content: chatInput,
            }
            gameSocketRef.current.emit("msgToServer", { messageObj });
            document.querySelector("#chatInput").value = "";
        }
        else {
            NotificationManager.error("No message entered");
        }
    }

    return (
        <div className="chatTab">
            <Container className="turnHeader">
                <TurnHeader gameData={gameData} />
            </Container>
            <Container>
                <h4>Chat</h4>
                <Container>
                    <Container className="chat">
                        {messages.map((msg, key) => {
                            return <>
                                <ChatMessage msgObj={msg} key={key} />
                            </>
                        })}
                        <div ref={bottomRef}></div>
                    </Container>
                    <Form>
                        <InputGroup className="mb-2">
                            <FormControl id="chatInput" placeholder="Enter message" autoComplete="off" onChange={(e) => setChatInput(e.target.value)} />
                            <Button type="submit" onClick={handleClick}>Send</Button>
                        </InputGroup>
                    </Form>
                </Container>
            </Container>
        </div>
    )
}

export default Chat;