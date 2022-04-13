import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import MainNav from "./navbar";
import { useDispatch, useSelector } from "react-redux";
import { setCurrPlayer, resetCurrPlayer } from "../actions";

function JoinGameForm({ gameSocketRef }) {
    const [userName, setUserName] = useState("");
    const currUser = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const isInGame = gameData.game !== "none";
    const dispatch = useDispatch();

    const handleClick = (e) => {
        e.preventDefault();
        if (!userName) {
            alert("Invalid input!")
        } else {
            dispatch(setCurrPlayer(userName));
            gameSocketRef.current.emit("joinGame", { username: userName });
            setUserName("");
        }

    }

    const leaveQueue = () => {
        gameSocketRef.current.emit("leaveQueue", { username: currUser });
        dispatch(resetCurrPlayer());
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