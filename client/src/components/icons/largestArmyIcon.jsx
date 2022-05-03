import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./icons.css";

function LargestArmyIcon({ playerColor, lasrgestArmyPlayer }) {
    const display = playerColor === lasrgestArmyPlayer ? "initial" : "none";

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 100, hide: 200 }}
            overlay={<Tooltip>Largest army (Worth 2 points)</Tooltip>}>
            <img src={require("../../assets/army.jpg")} style={{ display: "initial" }} className="icon" alt="Largest army" />
        </OverlayTrigger>

    )
}

export default LargestArmyIcon;