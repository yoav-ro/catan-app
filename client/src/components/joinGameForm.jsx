import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MainNav from "./navbar";

function JoinGameForm({ gameSocketRef, setCurrUser, currUser }) {
    const [userName, setUserName] = useState("");
    const gameData = useSelector(state => state.gameReducer);
    const isInGame = gameData.game !== "none";

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

    if (!currUser) {
        return (
            <div>
                <MainNav />
                <Container>
                    <h2>Find a game</h2>
                    <Form>
                        <Form.Control type="text" placeholder="Enter player name" onChange={(e) => setUserName(e.target.value)} />
                        <Button type="submit" onClick={handleClick}>Join</Button>
                    </Form>
                </Container>
            </div>

        )
    }
    if (isInGame) {
        return (
            <div>
                <MainNav />
                <Container>
                    <h2>Your game is ready!</h2>
                    <p>
                        To view your game click the "Game" tab or press the button:
                    </p>
                    <Link to="/game">
                        <Button>
                            To your game
                        </Button>
                    </Link>
                </Container>
            </div>
        )
    }
    return (
        <div>
            <MainNav />
            <Container>
                <h2>Welcome {currUser}</h2>
                <h3>Looking for game...</h3>
                <Button onClick={leaveQueue}>Leave queue</Button>
            </Container>
        </div>

    )


}

export default JoinGameForm;