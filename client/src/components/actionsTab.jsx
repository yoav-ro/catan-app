import React from "react";
import { Col } from "react-bootstrap";
import RollDiceBtn from "./actions/rollDiceBtn";
import EndTurnBtn from "./actions/endTurnBtn";

function ActionsDeck({ gameSocketRef }) {

    return (
        <Col>
            <h5>Actions:</h5>
            <RollDiceBtn gameSocketRef={gameSocketRef} />
            <div>Activate dev card</div>
            <div>Offer a trade</div>
            <EndTurnBtn gameSocketRef={gameSocketRef} />
        </Col>
    )
}

export default ActionsDeck;