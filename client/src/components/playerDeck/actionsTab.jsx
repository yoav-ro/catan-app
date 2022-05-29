import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import RollDiceBtn from "../actions/rollDiceBtn";
import EndTurnBtn from "../actions/endTurnBtn";
import BuyDevCardBtn from "../actions/getDevCardBtn";
import DevCardMenuBtn from "../actions/devCardMenuBtn";
import DropResourcesBtn from "../actions/dropResourceFormBtn";

function ActionsDeck({ gameSocketRef }) {

    return (
        <Col>
            <Row>
                <h5>Actions:</h5>
            </Row>
            <Row>
                <Col>
                    <RollDiceBtn gameSocketRef={gameSocketRef} />
                    <DevCardMenuBtn gameSocketRef={gameSocketRef} />
                    {/* <div>Offer a trade</div> */}
                </Col>
                <Col>
                    <BuyDevCardBtn gameSocketRef={gameSocketRef} />
                    <DropResourcesBtn gameSocketRef={gameSocketRef} />
                    <EndTurnBtn gameSocketRef={gameSocketRef} />
                </Col>
            </Row>

        </Col>
    )
}

export default ActionsDeck;