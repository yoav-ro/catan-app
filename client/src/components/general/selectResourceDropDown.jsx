import React from "react";
import { Dropdown } from "react-bootstrap";
import { resourceStyle } from "../../utils/helperFunctions";

function SelectResourceDropDown({ selectCallBack }) {

    return (
        <Dropdown onSelect={(eventKey) => selectCallBack(eventKey)}>
            <Dropdown.Toggle>
                First resource:
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {["Wood", "Brick", "Iron", "Sheep", "Wheat"].map((item, key) => {
                    return (
                        <Dropdown.Item
                            key={key}
                            style={resourceStyle(item)}
                            eventKey={item}>
                            {item}
                        </Dropdown.Item>
                    )
                })}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default SelectResourceDropDown;