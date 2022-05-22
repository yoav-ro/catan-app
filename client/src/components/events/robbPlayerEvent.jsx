import React from "react";
import { Container, Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { activeEventTypes } from "../../utils/constants";

function RobbPlayer({ show, handleClose, event }) {
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const opponents = gameData.game.game.players.filter(player => player.playerName.username !== currPlayer);


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
                            {opponents.map((opponent, key) => {
                                return (<Container key={key}>
                                    <div>{opponent.playerName.username} ({opponent.color})</div>
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

export default DiceRoller;