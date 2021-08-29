/**
 * The supported queries in the drop down. The leading and closing parantheses are supplied in usage to the Overpass API call, so the filters might look a bit wacky.
 */
export const locationTypeToOverpassQueryMap = {
    "restaurant": "amenity=restaurant",
    "coffee": "cuisine=coffee_shop][name!=Starbucks",
    "park": "leisure=park",
    "bookstore": "shop=books",
    "bar": "amenity=bar"
}

export class Map {
    static urlTemplate = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    static mapAttribution = `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
    &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`;
    static defaultLatitude = 53.079;
    static defaultLongitude = 8.81308;
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
        static phone = "phone";
    }
}