import React from "react";
import { Modal, Button } from "react-bootstrap";

function BuildSettelment({ onHide }) {

    return (
        <div>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Modal heading
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Build a settelment</h4>
                <p>
                    You are about to build a new settelment.
                    It will cost:
                    1 Wood
                    1 Sheep
                    1 Wheat
                    1 Brick
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </div>
    );
}

export default BuildSettelment;