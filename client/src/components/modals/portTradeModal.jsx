import React, { useState } from "react";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import SelectResourceDropDown from "../general/selectResourceDropDown";
import { resourceStyle } from "../../utils/helperFunctions";
import { resourcesTypes } from "../../utils/constants";
import { tradeWithPortDir } from "../../utils/directiveCreator";
import { useSelector } from "react-redux";

function PortTradeModal({ portType, show, handleClose, gameSocketRef }) {
    const [resourceToGive, setResourceToGive] = useState(portType === "3to1" ? "" : portType);
    const [resourceToReceive, setResourceToReceive] = useState("");

    const gameData = useSelector(state => state.gameReducer);
    const currPlayer = useSelector(state => state.playerReducer);
    const players = gameData.game.game.players;

    const player = players.find(player => player.playerName.username === currPlayer);

    const totalResources = [resourcesTypes.WHEAT.name, resourcesTypes.WOOD.name, resourcesTypes.IRON.name, resourcesTypes.SHEEP.name, resourcesTypes.BRICK.name];
    const filteredResources = totalResources.filter(item => item !== resourceToGive);

    const handleConfirm = () => {
        const directive = tradeWithPortDir(player.color, portType, resourceToGive.toLowerCase(), resourceToReceive.toLowerCase());
        gameSocketRef.current.emit("newDirective", { directive: directive });
        setResourceToGive(portType === "3to1" ? "" : portType);
        setResourceToReceive("");
        handleClose();
    }

    if (portType !== "3to1") {
        return (
            <div>
                <Modal show={show} onHide={handleClose}>
                    <Form>
                        <Modal.Header closeButton>
                            <Modal.Title>Port Trade</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Container>
                                <div>This is a {portType} port. You can trade 2 {portType} resources for any resource you like.</div>
                                <br />
                                <Row>
                                    <Col>
                                        <SelectResourceDropDown selectCallBack={setResourceToReceive} dropDownHeader="Receive" resources={filteredResources} />
                                    </Col>
                                </Row> <br />
                                2 X <span style={resourceStyle(resourceToGive)}>{resourceToGive}</span> {" 🡆 "}  1 X <span style={resourceStyle(resourceToReceive)}>{resourceToReceive ? resourceToReceive : "Not Selected"}</span>
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
        )
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Port Trade</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <div>This is a 3 to 1 port. You can trade 3 of the same resource for any resource you like.</div>
                            <br />
                            <Row>
                                <Col>
                                    <SelectResourceDropDown selectCallBack={setResourceToGive} dropDownHeader="Give" resources={filteredResources} />
                                </Col>
                                <Col>
                                    <SelectResourceDropDown selectCallBack={setResourceToReceive} dropDownHeader="Recieve" resources={filteredResources} />
                                </Col>
                            </Row> <br />
                            3 X <span style={resourceStyle(resourceToGive)}>{resourceToGive}</span> {" 🡆 "}  1 X <span style={resourceStyle(resourceToReceive)}>{resourceToReceive}</span>
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
    )
}

export default PortTradeModal;