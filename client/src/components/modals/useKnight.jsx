import React from "react";
import { Modal, Button, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { activateKnightDir } from "../../utils/directiveCreator";

function UseKnight({ show, handleClose, gameSocketRef }) {
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);
    const isSetup = gameData.game.game.isSetupPhase;

    const handleConfirm = () => {
        const directive = activateKnightDir(player.color);
        gameSocketRef.current.emit("newDirective", { directive: directive });
        handleClose();
    }
    if (isSetup) {
        return <></>
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Activate Knight</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <div>You are about to use a knight development card.</div>
                            <div>It will allow you move the robber from its current position to any new tile on the board.</div>
                            <div>You may rob a player setteled on the new tile.</div>
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
                </Form>
            </Modal>
        </div>
    );
}

export default UseKnight;