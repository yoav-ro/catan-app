import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { resetCurrPlayer, resetGameData } from "../../actions";
import { LinkContainer } from "react-router-bootstrap";

function LobbyBtn({ text, shouldResetData }) {
    const dispatch = useDispatch();
    const btnText = text ? text : "Return to lobby";

    const handleReset = () => {
        if (shouldResetData) {
            dispatch(resetGameData());
            dispatch(resetCurrPlayer());
        }
    }

    console.log("reset complete")
    return (
        <LinkContainer to="/">
            <Button variant="primary" onClick={handleReset}>
                {btnText}
            </Button>
        </LinkContainer>
    )
}

export default LobbyBtn;