import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import RollDiceBtn from "./actions/rollDiceBtn";
import EndTurnBtn from "./actions/endTurnBtn";
import BuyDevCardBtn from "./actions/getDevCardBtn";

function ActionsDeck({ gameSocketRef }) {

    return (
        <Col>
            <Row>
                <h5>Actions:</h5>
            </Row>
            <Row>
                <Col>
                    <RollDiceBtn gameSocketRef={gameSocketRef} />
                    <div>Activate dev card</div>
                    <div>Offer a trade</div>
                    <EndTurnBtn gameSocketRef={gameSocketRef} />
                </Col>
                <Col>
                    <BuyDevCardBtn gameSocketRef={gameSocketRef} />
                </Col>
            </Row>

        </Col>
    )
}

export default ActionsDeck;