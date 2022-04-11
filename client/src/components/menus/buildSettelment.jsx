import React from "react";
import { Modal } from "react-bootstrap";
import { BuildSettelment } from "../../utils/directiveCreator";

function BuildSettelment({color}) {

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Modal heading
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Build a settelment</h4>
                <p>
                    You are about to build a new {color}.
                    It will cost:
                    1 Wood
                    1 Sheep
                    1 Wheat
                    1 Brick
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default BuildSettelment;