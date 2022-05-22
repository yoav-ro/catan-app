import React from "react";
import { Container, Modal, Button, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { robbPlayerDir } from "../../utils/directiveCreator";
import "../styles/playerDeck.css";

function RobbPlayer({ show, handleClose, event }) {
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const board = gameData.game.game.board;

    //Find all robbAble players
    const robbedTile = board.tiles.find(tile => tile.isRobber); // Getting the coordiantes of the tile with the robber on it
    const tileJunctions = [
        robbedTile.coordinates.top, robbedTile.coordinates.topLeft, robbedTile.coordinates.topRight,
        robbedTile.coordinates.bottom, robbedTile.coordinates.bottomLeft, robbedTile.coordinates.bottomRight
    ];
    const playersOnTile = [];
    for (let junction of board.builtJunctions) { // Getting all the players with build junctions other the tile
        if (tileJunctions.includes({ x: junction.x, y: junction.y })) {
            if (!playersOnTile.includes(junction.player)) {
                playersOnTile.push(junction.player);
            }
        }
    }

    const robbAblePlayers = gameData.game.game.players.filter(player => player.playerName.username !== currPlayer && playersOnTile.includes(player.color));

    const handleConfirm = () => {

    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Robb a player</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        Select a player to robb:
                        <Row>
                            {robbAblePlayers.map((opponent, key) => {
                                return (<Container key={key}>
                                    <div className="playerHeader" style={{ color: opponent.color }}>{opponent.playerName.username} ({opponent.color})</div>
                                    {opponent.resources.lenght} resources
                                </Container>)
                            })}
                        </Row>

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