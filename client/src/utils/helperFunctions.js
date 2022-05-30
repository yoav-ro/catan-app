import { resourcesTypes } from "./constants";

export function resourceStyle(resource) {
    if (resource) {
        const style = {
            color: resourcesTypes[resource.toUpperCase()].color,
            WebkitTextStroke: "0.3px black",
            fontWeight: "bold",
        }
        return style;
    }
}