import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import MainNav from "./navbar";
import { useDispatch, useSelector } from "react-redux";
import { setCurrPlayer, resetCurrPlayer } from "../actions";
import { NotificationManager } from 'react-notifications';

function JoinGameForm({ gameSocketRef }) {
    const [userName, setUserName] = useState("");
    const currUser = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const isInGame = gameData.game !== "none";
    const dispatch = useDispatch();

    const handleClick = (e) => {
        e.preventDefault();
        if (!userName) {
            NotificationManager.error("Invalid input");
        } else {
            gameSocketRef.current.emit("joinGame", { username: userName });
            gameSocketRef.current.on("lobby", data => {
                if (data !== "User name already taken") {
                    dispatch(setCurrPlayer(userName));
                }
                else {
                    NotificationManager.error("User name already taken");
                    document.querySelector("#userNameInput").value = "";
                }
            })
            setUserName("");
        }
    }

    const leaveQueue = () => {
        dispatch(resetCurrPlayer());
        gameSocketRef.current.emit("leaveQueue", { username: currUser });
        setUserName("");
    }

    if (!currUser) {
        return (
            <div>
                <MainNav />
                <Container>
                    <h2>Find a game</h2>
                    <Form>
                        <Form.Control id="userNameInput" type="text" placeholder="Enter player name" value={userName} onChange={(e) => setUserName(e.target.value)} />
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