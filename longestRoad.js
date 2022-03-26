const getRoadObj = (startX, startY, endX, endY, color) => {
    return {
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        color: color,
    }
}

const roads = [
    getRoadObj(363.73066958946424, 35, 303.10889132455355, 0, "blue"),
    getRoadObj(363.73066958946424, 35, 363.7306695894643, 105, "blue"),
    getRoadObj(363.73066958946424, 105, 303.10889132455355, 140, "blue"),
    getRoadObj(303.10889132455355, 140, 303.10889132455355, 210, "blue"),
    getRoadObj(363.73066958946424, 245, 303.10889132455355, 210, "blue"),
    getRoadObj(303.10889132455355, 210, 242.48711305964284, 245, "blue"),
    getRoadObj(242.48711305964284, 245, 242.48711305964284, 315, "blue"),
    getRoadObj(424.35244785437493, 210, 363.73066958946424, 245, "red"),
    getRoadObj(363.73066958946424, 245, 363.73066958946424, 315, "red"),
]
// console.log(roads)
findLongestRoad(roads);

function findLongestRoad(roads) {
    const test = theRecurtionThing(roads);
    // console.log(test);
}

function theRecurtionThing(currRoadSeq) {
    const nextSeq = findConnectedRoads(currRoadSeq);
    if (nextSeq.length === 0) {
        return currRoadSeq;
    }

    nextSeq.forEach(newNode => {
        const newSeq = currRoadSeq.slice().push(newNode);
        console.log(newNode);
        // console.log(newSeq);
        return theRecurtionThing(newSeq);
    })
}

function findConnectedRoads(roadSeq) {
    console.log(roadSeq)
    const lastRoad = roadSeq[roadSeq.length - 1];
    // console.log(lastRoad)
    const { color, startX, startY, endX, endY } = lastRoad;
    const connectedRoads = [];
    roads.forEach(road => {
        if (road.color === color && !roadSeq.includes[road]) {
            if (road.startX === startX && road.startY === startY && road.endX !== endX && road.endX !== endY) {
                if (validateRoadSequence(road.startX, road.startY)) {
                    connectedRoads.push(road);
                }
            }
            if (road.startX !== startX && road.startY !== startY && road.endX === endX && road.endX === endY) {
                if (validateRoadSequence(road.endX, road.endY)) {
                    connectedRoads.push(road);
                }
            }
            if (road.startX === endX && road.startY === endY && road.endX !== startX && road.endX !== startY) {
                if (validateRoadSequence(road.startX, road.startY)) {
                    connectedRoads.push(road);
                }
            }
            if (road.endX === startX && road.endY === startY && road.startX !== endX && road.startY !== endY) {
                if (validateRoadSequence(road.endX, road.endY)) {
                    connectedRoads.push(road);
                }
            }
        }
    })
    return connectedRoads;
}

function validateRoadSequence(player, x, y) {
    // if (getJunctionStatus(x, y).player !== player) {
    //     return false;
    // }
    return true;
}