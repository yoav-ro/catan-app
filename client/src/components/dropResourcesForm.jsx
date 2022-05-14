import React, { useState } from "react";
import { Container, Form, Dropdown, Button, Row, Col } from "react-bootstrap";
import { resourcesTypes } from "../utils/constants";
import { useSelector } from "react-redux";

function DropResourcesForm() {
    const [selectedResources, setSelectedResources] = useState([]);

    // const gameData = useSelector(state => state.gameReducer);
    // const currPlayer = useSelector(state => state.playerReducer);
    // const players = gameData.game.game.players;
    const player = {
        resources: ["wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wheat", "wheat", "wheat", "wheat"]
    }

    // const player = players.find(player => player.playerName.username === currPlayer);
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
        setSelectedResources([]);
    }

    const handleSelectResource = (item) => {
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
                    {["Wood", "Brick", "Iron", "Sheep", "Wheat"].map((item, key) => {
                        return (
                            <Col key={key} xs="auto">
                                <div style={resourceStyle(item)}>{item}</div>
                                <Dropdown aria-disabled={"true"} onSelect={() => setSelectedResources([...selectedResources, item])}>
                                    <Dropdown.Toggle>
                                        Select
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {[...Array(requiredDropCount).keys()].map((item, key) => {
                                            return (
                                                <Dropdown.Item
                                                    disabled
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
            </Container>
        </Form>
    )
}

export default DropResourcesForm;