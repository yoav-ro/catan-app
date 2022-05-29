import React, { useState } from "react";
import { Modal, Button, Row, Col, Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { activateYoPDir } from "../../utils/directiveCreator";
import { NotificationManager } from "react-notifications";
import { resourcesTypes } from "../../utils/constants";

function UseYoP({ show, handleClose, gameSocketRef }) {
    const [resourceA, setResourceA] = useState("");
    const [resourceB, setResourceB] = useState("");
    const currPlayer = useSelector(state => state.playerReducer);
    const gameData = useSelector(state => state.gameReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);
    const isSetup = gameData.game.game.isSetupPhase;

    const handleConfirm = () => {
        if (!resourceA || !resourceB) {
            NotificationManager.error("Missing input!")
            return;
        }
        const directive = activateYoPDir(player.color, resourceA.toLowerCase(), resourceB.toLowerCase());
        gameSocketRef.current.emit("newDirective", { directive: directive });
        setResourceA("");
        setResourceB("");
        handleClose();
    }

    const resourceStyle = (resource) => {
        if (resource) {
            const style = {
                color: resourcesTypes[resource.toUpperCase()].color,
                WebkitTextStroke: "0.3px black",
                fontWeight: "bold",
            }
            return style;
        }
    }

    if (isSetup) {
        return <></>
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Activate Year of Plenty</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>You are about to use a year of plenty development card.</div>
                    <div>It will allow you to take 2 resources of your choise from the bank.</div>
                    <br />
                    <div>Choose resource:</div>
                    <Row>
                        <Col>
                            <Dropdown onSelect={(eventKey) => setResourceA(eventKey)}>
                                <Dropdown.Toggle>
                                    First resource:
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {["Wood", "Brick", "Iron", "Sheep", "Wheat"].map((item, key) => {
                                        return (
                                            <Dropdown.Item
                                                key={key}
                                                style={resourceStyle(item)}
                                                eventKey={item}>
                                                {item}
                                            </Dropdown.Item>
                                        )
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                            Selected:<div style={resourceStyle(resourceA)}>{resourceA}</div>
                        </Col>
                        <Col>
                            <Dropdown onSelect={(eventKey) => setResourceB(eventKey)}>
                                <Dropdown.Toggle>
                                    Second resource:
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {["Wood", "Brick", "Iron", "Sheep", "Wheat"].map((item, key) => {
                                        return (
                                            <Dropdown.Item
                                                key={key}
                                                style={resourceStyle(item)}
                                                eventKey={item}>
                                                {item}
                                            </Dropdown.Item>
                                        )
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                            Selected:<div style={resourceStyle(resourceB)}>{resourceB}</div>
                        </Col>
                    </Row>
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
        </div >
    );
}
export default UseYoP;