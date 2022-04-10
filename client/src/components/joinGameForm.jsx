import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

function JoinGameForm({ gameSocketRef, setCurrUser, currUser }) {
    const [userName, setUserName] = useState("");

    const handleClick = (e) => {
        e.preventDefault();
        if (!userName) {
            alert("Invalid input!")
        } else {
            //joinsocket
            setCurrUser(userName);
            console.log("joining")
            gameSocketRef.current.emit("joinGame", { username: userName });
            setUserName("");
        }

    }

    const leaveQueue = () => {
        gameSocketRef.current.emit("leaveQueue", { username: currUser });
        setCurrUser("");
    }

    const getGame = (e) => {
        gameSocketRef.current.emit("newDirective", { directive: "test" });
    }
    if (!currUser) {
        return (
            <Container>
                <h2>Find a game</h2>
                <Form>
                    <Form.Control type="text" placeholder="Enter player name" onChange={(e) => setUserName(e.target.value)} />
                    <Button type="submit" onClick={handleClick}>Join</Button>
                </Form>
                <button onClick={getGame}>Get game</button>
            </Container>
        )
    }
    return (
        <Container>
            <h2>Welcome {currUser}</h2>
            <h3>Looking for game...</h3>
            <Button onClick={leaveQueue}>Leave queue</Button>
        </Container>
    )


}

export default JoinGameForm;