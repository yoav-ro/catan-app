import React, { useState } from "react";
import { Container, Form, Dropdown, Button, Row, Col } from "react-bootstrap";
import { resourcesTypes } from "../utils/constants";
import { useSelector } from "react-redux";

function DropResourcesForm({ selectedResources, setSelectedResources }) {

    const gameData = useSelector(state => state.gameReducer);
    const currPlayer = useSelector(state => state.playerReducer);
    const players = gameData.game.game.players;
    // const player = {
    //     resources: ["wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wheat", "wheat", "wheat", "wheat"]
    // }

    const player = players.find(player => player.playerName.username === currPlayer);

    const [resourcesMock, setResourcesMock] = useState(player.resources.slice()); //Modifiable resources array used to display updated resources after drop selections
    const requiredDropCount = player.resources.length % 2 > 0 ? (player.resources.length / 2) - 0.5 : player.resources.length / 2;

    const resourceStyle = (resource) => {
        if (resource) {
            const style = {
                color: resourcesTypes[resource.toUpperCase()].color,
                WebkitTextStroke: "0.3px black",
                fontWeight: "bold",
            }
            return style;
        }
    }
    const clearSelectedClick = () => {
        setResourcesMock(player.resources.slice());
        setSelectedResources([]);
    }

    const handleSelectResource = (resourceType, dropCount) => {
        const dropCountInt = parseInt(dropCount);
        const newResourcesToDrop = Array(dropCountInt).fill(resourceType);
        const totalResourceCount = resourcesMock.filter(resource => resource === resourceType.toLowerCase()).length;

        const filteredMock = [];
        let dropCounter = 0;
        for (let i = 0; i < resourcesMock.length; i++) {
            if (resourcesMock[i] === resourceType.toLowerCase()) {
                if (dropCounter < totalResourceCount - dropCount) {
                    filteredMock.push(resourcesMock[i]);
                    dropCounter++;
                }
            }
            else {
                filteredMock.push(resourcesMock[i])
            }
        }
        setResourcesMock(filteredMock);
        setSelectedResources([...selectedResources, ...newResourcesToDrop]);
    }

    return (
        <Form>
            <Container>
                <h2>You need to drop resources!</h2>
                <div>
                    After rolling 7, every player with 8 or more resources, need to drop half of its resources.
                </div>
                <div>
                    You have {player.resources.length} resources, meaning you need to drop {requiredDropCount} resources.
                </div>
                <Row>
                    {["Wood", "Brick", "Iron", "Sheep", "Wheat"].map((mainResource, key) => {
                        return (
                            <Col key={key} xs="auto">
                                <div style={resourceStyle(mainResource)}>{mainResource}</div>
                                <Dropdown aria-disabled={"true"} onSelect={(eventKey) => handleSelectResource(mainResource, eventKey)}>
                                    <Dropdown.Toggle>
                                        Select
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {[...Array(resourcesMock.filter(resource => resource === mainResource.toLowerCase()).length + 1).keys()].map((item, key) => {
                                            return (
                                                <Dropdown.Item
                                                    key={key}
                                                    eventKey={item}>
                                                    {item}
                                                </Dropdown.Item>
                                            )

                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        )
                    })}
                </Row>
                <Col>
                    Selected resources: {selectedResources.length}/{requiredDropCount} <br />
                    {selectedResources.map((item, key) => {
                        return <span style={resourceStyle(item)} key={key}>{item}, </span>
                    })}
                </Col>
                <Col>
                    <Button onClick={clearSelectedClick}>Clear Selected</Button>
                </Col>
                <br />
            </Container>
        </Form>
    )
}

export default DropResourcesForm;