const getRoadObj = (startX, startY, endX, endY, color) => {
    return {
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        color: color,
    }
}
const longestRoads = [];
const roads = [
    getRoadObj(364.73066958946424, 35, 303.10889132455355, 0, "blue"), //0
    getRoadObj(364.73066958946424, 35, 364.73066958946424, 105, "blue"), //1
    getRoadObj(364.73066958946424, 105, 303.10889132455355, 140, "blue"), //2
    getRoadObj(303.10889132455355, 140, 303.10889132455355, 210, "blue"), //3
    getRoadObj(364.73066958946424, 245, 303.10889132455355, 210, "blue"), //4
    getRoadObj(303.10889132455355, 210, 242.48711305964284, 245, "blue"), //5
    getRoadObj(242.48711305964284, 245, 242.48711305964284, 315, "blue"), //6
    getRoadObj(424.35244785437493, 210, 364.73066958946424, 245, "red"), //7
    getRoadObj(364.73066958946424, 245, 364.73066958946424, 315, "red"), //8
]
//longest should be (road indexes): [0,1,2,3,5,6]

function getLongestArrayInArray(array) {
    let longest = [];
    array.forEach(arr => {
        if (arr.length > longest.length) {
            longest = arr;
        }
    })
    return longest;
}

function calcLongestRoad() {
    let longestRoad = [];
    roads.forEach(road => {
        const longestByMyRoad = getLongestFromSegment([road], []);
        if (longestByMyRoad.length > longestRoad.length) {
            longestRoad = longestByMyRoad;
        }
    });
    return longestRoad;
}


function getLongestFromSegment(currSeq, siblingRoads) {
    const nextSegments = checkSegmentNeighbor(currSeq, siblingRoads);
    if (nextSegments.length > 0) {
        for (let i = 0; i < nextSegments.length; i++) {
            const segmentsCopy = nextSegments.slice();
            segmentsCopy.splice(i, 1);
            const nextProcess = [...currSeq, nextSegments[i]];
            return getLongestFromSegment(nextProcess, segmentsCopy);
        }
    }
    return currSeq;
}

function checkSegmentNeighbor(roadSeq, siblingRoads) {
    const lastRoad = roadSeq[roadSeq.length - 1];
    const connectedRoads = [];
    roads.forEach(road => {
        if (!roadSeq.includes(road) && !siblingRoads.includes(road)) {
            if (areRoadsConnected(lastRoad, road)) {
                connectedRoads.push(road);
            }
        }
    })
    return connectedRoads;
}

function areRoadsConnected(roadA, roadB) {
    const { color: colorA, startX: startXA, startY: startYA, endX: endXA, endY: endYA } = roadA;
    const { color: colorB, startX: startXB, startY: startYB, endX: endXB, endY: endYB } = roadB;
    if (colorA === colorB) {
        if ((startXA === startXB && startYA === startYB) && (endXA !== endXB || endYA !== endYB)) {
            if (validateRoadSequence(startXA, startYA)) {
                return true;
            }
        }
        if ((startXA !== startXB || startYA !== startYB) && (endXA === endXB && endYA === endYB)) {
            if (validateRoadSequence(endXA, endYA)) {
                return true;
            }
        }
        if ((startXA === endXB && startYA === endYB) && (endXA !== startXB || endYA !== startYB)) {
            if (validateRoadSequence(startXA, startYA)) {
                return true;
            }
        }
        if ((startXA !== endXB || startYA !== endYB) && (endXA === startXB && endYA === startYB)) {
            if (validateRoadSequence(endXA, endYA)) {
                return true;
            }
        }
    }
    return false;
}


function validateRoadSequence(player, x, y) {
    // if (getJunctionStatus(x, y).player !== player) {
    //     return false;
    // }
    return true;
}