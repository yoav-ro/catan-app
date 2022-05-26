import React, { useState } from "react";
import { Container, Modal, Button, Row, Form } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import { robbPlayerDir } from "../../utils/directiveCreator";
import "../styles/playerDeck.css";

function RobbPlayer({ show, handleClose, gameSocketRef }) {
    const [chosenPlayer, setChosenPlayer] = useState("");
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const board = gameData.game.game.board;

    const players = gameData.game.game.players;
    const player = players.find(player => player.playerName.username === currPlayer);

    const roundNum = (num) => { return Math.round((num + Number.EPSILON) * 100) / 100 };
    const roundCoords = (coords) => { return { x: roundNum(coords.x), y: roundNum(coords.y) } };

    const robbedTile = board.tiles.find(tile => tile.isRobber); // Getting the coordiantes of the tile with the robber on it
    const roundTileJunctions = [
        roundCoords(robbedTile.coordinates.top), roundCoords(robbedTile.coordinates.topLeft), roundCoords(robbedTile.coordinates.topRight),
        roundCoords(robbedTile.coordinates.bottom), roundCoords(robbedTile.coordinates.bottomLeft), roundCoords(robbedTile.coordinates.bottomRight),
    ];

    const playersOnTile = [];
    for (let coord of board.builtJunctions) { // Getting all the players with build junctions other the tile
        if (roundTileJunctions.some(tileCoord => tileCoord.x === roundNum(coord.x) && tileCoord.y === roundNum(coord.y))) {
            if (!playersOnTile.includes(coord.player)) {
                playersOnTile.push(coord.player);
            }
        }
    }
    const robbAblePlayers = gameData.game.game.players.filter(player => player.playerName.username !== currPlayer && playersOnTile.includes(player.color));

    const handleConfirm = () => {
        if (!chosenPlayer) {
            NotificationManager.error("No player selected");
        }
        else {
            const directive = robbPlayerDir(player.color, chosenPlayer.color);
            gameSocketRef.current.emit("newDirective", { directive: directive });
            handleClose();
        }
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Robb a player</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Container id="robForm" style={{ display: robbAblePlayers.length > 0 ? "initial" : "none" }}>
                            Select a player to rob:
                            <Form>
                                {robbAblePlayers.map((opponent, key) => {
                                    return (<Container key={key}>
                                        <Form.Check
                                            type="radio"
                                            name="robbAble"
                                            style={{ color: opponent.color }}
                                            className="playerHeader"
                                            label={`${opponent.playerName.username} (${opponent.color}, ${opponent.resources.length} resources)`}
                                            onChange={() => setChosenPlayer(opponent)}
                                        />
                                    </Container>)
                                })}
                            </Form>
                        </Container>
                        <Container id="noRobbAble" style={{ display: robbAblePlayers.length > 0 ? "none" : "initial" }}>
                            No opponents on this tile.
                        </Container>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default RobbPlayer;