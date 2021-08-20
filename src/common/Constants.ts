export const locationTypeToOverpassQueryMap = {
    "restaurant": "amenity=restaurant",
    "park": "leisure=park",
    "railway station": "railway=station",
    "bar": "amenity=bar"
}

export function getDropdownList() {
    let listOfKeys = Object.keys(locationTypeToOverpassQueryMap);

    return listOfKeys.map((val, index) => { 
        return { idx: index, text: val}
    });
}

export class Map {
    static urlTemplate = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    static mapAttribution = `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
    &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`;
}

export class OSMNode {
    static recommendationVipSubstrings = ["name", "addr", "website"];

    static addrPrefix = "addr:";
    
    static Properties = class {
        static nameProp = "name";
        static city = OSMNode.addrPrefix+"city";
        static houseNumber = OSMNode.addrPrefix+"housenumber";
        static country = OSMNode.addrPrefix+"country";
        static state = OSMNode.addrPrefix+"state";
        static street = OSMNode.addrPrefix+"street";
        static website = "website";
        static contactWebsite = "contact:website";
    }
}