import React, { useState } from "react";
import { Modal, Button, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { activateMonopolyDir } from "../../utils/directiveCreator";
import { NotificationManager } from "react-notifications";
import { resourcesTypes } from "../../utils/constants";

function UseMonopoly({ show, handleClose, gameSocketRef }) {
    const [resource, setResource] = useState("");
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);
    const isSetup = gameData.game.game.isSetupPhase;
    
    const handleConfirm = () => {
        if (!resource) {
            NotificationManager.error("No resource selected!")
        }
        const directive = activateMonopolyDir(player.color, resource);
        console.log(directive)
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
                        <Modal.Title>Activate Monopoly</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <div>You are about to use a monopoly development card.</div>
                            <div>It will allow you to take all resources from a type of your choice from all other players.</div>
                            <br />
                            <div>Choose resource:</div>
                            {["Wood", "Brick", "Iron", "Sheep", "Wheat"].map((item, key) => {
                                return (
                                    <Form.Check
                                        type="radio"
                                        label={item}
                                        name="resources"
                                        value={item.toLowerCase()}
                                        inline
                                        onChange={(e) => { setResource(e.target.value) }}
                                        style={{ color: resourcesTypes[item.toUpperCase()].color, WebkitTextStroke: "0.3px black", fontWeight: "bold" }}
                                        key={key}
                                        defaultChecked={key === 0}
                                    />
                                )
                            })}
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

export default UseMonopoly;