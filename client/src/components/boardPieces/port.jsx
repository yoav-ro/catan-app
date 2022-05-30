import React, { useState, } from "react";
import { resourcesTypes } from "../../utils/constants";

function Port({ type, x, y, scale: scaleInput }) {
    const [scale, setScale] = useState(scaleInput);
    let text;
    let color;

    const textHightCorrection = y > 312 ? 40 : -3
    let textCenterCorrection;

    switch (type) {
        case "3to1":
            color = "black";
            text = "3 : 1"
            textCenterCorrection = 3
            break;
        case resourcesTypes.WOOD.name:
            color = resourcesTypes.WOOD.color;
            text = "Wood 2 : 1"
            textCenterCorrection = -15;
            break;
        case resourcesTypes.IRON.name:
            color = resourcesTypes.IRON.color;
            text = "Iron 2 : 1"
            textCenterCorrection = -10;
            break;
        case resourcesTypes.BRICK.name:
            color = resourcesTypes.BRICK.color;
            textCenterCorrection = -12;
            text = "Brick 2 : 1"
            break;
        case resourcesTypes.WHEAT.name:
            color = resourcesTypes.WHEAT.color;
            textCenterCorrection = -16;
            text = "Wheat 2 : 1"
            break;
        case resourcesTypes.SHEEP.name:
            color = resourcesTypes.SHEEP.color;
            text = "Sheep 2 : 1"
            textCenterCorrection = -15;
            break;
        default:
            break;
    }


    const handleHoverIn = () => {
        setScale(scale * 1.3);
    }

    const handleHoverOut = () => {
        setScale(scale / 1.3);
    }

    const handleClick = () => {
        console.log(`Port type ${type} at (${x}, ${y})`);
    }
    const unscale = 1 / scale;

    return (
        <g onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut} onClick={handleClick}>
            <g transform={`scale(${scale}) translate(${x * unscale}, ${y * unscale})`}>
                <path fill={color} strokeWidth={1 * unscale} stroke="black" d="M226.496,190.563c2.862-0.638,5.832-0.639,8.695-0.001l113.612,25.286l-10.658-67.5c-1.112-7.041-7.171-12.233-14.3-12.252
            l-31.675-0.085l-5.185-64.064c-0.609-7.523-6.882-13.325-14.43-13.345l-21.56-0.058l0.1-37.157
            c0.03-11.045-8.9-20.024-19.946-20.054c-0.019,0-0.036,0-0.055,0c-11.02,0-19.969,8.919-19.999,19.946l-0.1,37.157l-20.988-0.056
            c-7.548-0.021-13.852,5.747-14.501,13.268l-5.529,64.036l-31.26-0.084c-7.128-0.019-13.216,5.14-14.365,12.175l-11.116,68.028
            L226.496,190.563z"/>
                <path fill={color} strokeWidth={1 * unscale} stroke="black" d="M110.416,375.186c17.402-12.674,38.307-19.514,60.277-19.514c21.969,0,42.875,6.841,60.277,19.514
            c17.402-12.674,38.307-19.514,60.277-19.514c21.969,0,42.872,6.84,60.275,19.512c7.392-5.388,15.418-9.711,23.883-12.916
            l27.664-76.601c1.417-3.924,1.077-8.268-0.932-11.924c-2.01-3.656-5.495-6.27-9.567-7.177l-161.721-35.994L69.365,266.558
            c-4.071,0.907-7.556,3.522-9.565,7.178c-2.009,3.656-2.348,7.999-0.931,11.922l27.675,76.632
            C95.007,365.49,103.029,369.806,110.416,375.186z"/>
                <path fill={color} strokeWidth={1 * unscale} stroke="black" d="M456.083,413.984c-11.828-11.828-27.554-18.342-44.281-18.342s-32.453,6.514-44.281,18.342
            c-4.273,4.273-9.954,6.626-15.997,6.626c-6.043,0-11.724-2.353-15.996-6.626c-12.209-12.208-28.246-18.312-44.282-18.312
            c-16.036,0-32.072,6.104-44.28,18.312c-4.273,4.273-9.954,6.626-15.997,6.626c-6.043,0-11.724-2.353-15.996-6.626
            c-12.209-12.208-28.246-18.312-44.282-18.312c-16.036,0-32.072,6.104-44.28,18.312c-4.41,4.41-10.204,6.615-15.996,6.615
            c-5.794,0-11.586-2.205-15.997-6.615c-12.208-12.208-28.245-18.312-44.281-18.312c-16.036,0-32.072,6.104-44.28,18.312
            c-7.811,7.811-7.811,20.474,0,28.284c7.81,7.81,20.473,7.811,28.284,0c4.41-4.41,10.203-6.615,15.997-6.615
            s11.586,2.205,15.997,6.616c12.208,12.208,28.244,18.312,44.28,18.312s32.073-6.104,44.281-18.312
            c4.41-4.411,10.204-6.616,15.997-6.616s11.586,2.205,15.996,6.616c11.827,11.827,27.554,18.341,44.28,18.341c0,0,0,0,0,0h0
            c16.727,0,32.453-6.514,44.281-18.342c4.41-4.41,10.204-6.615,15.997-6.615s11.586,2.205,15.996,6.616
            c11.827,11.827,27.554,18.341,44.28,18.341h0h0c16.727,0,32.453-6.514,44.281-18.342c4.273-4.272,9.954-6.626,15.997-6.626
            c6.043,0,11.724,2.354,15.997,6.626c7.811,7.81,20.473,7.811,28.284,0C463.894,434.458,463.894,421.794,456.083,413.984z"/>
            </g>
            <text fill="black" fontSize={11} x={x + textCenterCorrection} y={y + textHightCorrection} fontWeight="bold">{text}</text>
        </g>
    )
}

export default Port;