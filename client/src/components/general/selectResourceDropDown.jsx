import React from "react";
import { Dropdown } from "react-bootstrap";
import { resourcesTypes } from "../../utils/constants";
import { resourceStyle } from "../../utils/helperFunctions";

function SelectResourceDropDown({ selectCallBack, dropDownHeader, resources }) {
    const totalResources = [resourcesTypes.WHEAT.name, resourcesTypes.WOOD.name, resourcesTypes.IRON.name, resourcesTypes.SHEEP.name, resourcesTypes.BRICK.name];
    const filteredResources = resources.filter(item => totalResources.includes(item));
    const capitalized = filteredResources.map(item => [item[0].toUpperCase(), ...item.slice(1, item.length)].join(""));

    return (
        <Dropdown onSelect={(eventKey) => selectCallBack(eventKey)}>
            <Dropdown.Toggle>
                {dropDownHeader}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {capitalized.map((item, key) => {
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