import React from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function LobbyBtn({ text }) {
    const btnText = text ? text : "Return to lobby";
    return (
        <LinkContainer to="/">
            <Button variant="primary">
                {btnText}
            </Button>
        </LinkContainer>
    )
}

export default LobbyBtn;