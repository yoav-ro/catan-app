import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./icons.css";

function LongestRoadIcon({ playerColor, longestRoadPlayer }) {
    const display = playerColor === longestRoadPlayer ? "initial" : "none";

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 100, hide: 200 }}
            overlay={<Tooltip>Longest road (Worth 2 points)</Tooltip>}>
            <img src={require("../../assets/road.webp")} style={{ display: display }} className="icon" alt="Longest road" />
        </OverlayTrigger>)
}

export default LongestRoadIcon;