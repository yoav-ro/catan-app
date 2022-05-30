import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import SelectResourceDropDown from "../general/selectResourceDropDown";


function PortTradeModal({ portType, show, handleClose }) {
    const [resourceToGive, setResourceToGive] = useState(portType === "3to1" ? "" : portType);
    const [resourceToReceive, setResourceToReceive] = useState("");

    const handleConfirm = () => {

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
                                <div>This is a {portType} port. You can trade 2 {portType} resources for any resource you like</div>
                                <br />
                                <Row>
                                    <Col>
                                        2 X <div style={resourceStyle(resourceToGive)}>{resourceToGives}</div>
                                    </Col>
                                    <Col>{" => "}</Col>
                                    <Col>
                                        <SelectResourceDropDown selectCallBack={setResourceToReceive} />
                                        1 X <div style={resourceStyle(resourceToReceive)}>{resourceToReceive}</div>
                                    </Col>
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
                            <div>This is a 3 to 1 port. You can trade 3 of the same resource for any resource you like</div>
                            <br />
                            <Row>
                                <Col>
                                    <SelectResourceDropDown selectCallBack={setResourceToGive} />
                                    3 X <div style={resourceStyle(resourceToGive)}>{resourceToGive}</div>
                                </Col>
                                <Col>{" => "}</Col>
                                <Col>
                                    <SelectResourceDropDown selectCallBack={setResourceToReceive} />
                                    1 X <div style={resourceStyle(resourceToReceive)}>{resourceToReceive}</div>
                                </Col>
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
                </Form>
            </Modal>
        </div>
    )
}

export default PortTradeModal;