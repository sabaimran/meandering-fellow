export const locationTypeToOverpassQueryMap = {
    "restaurant": "amenity=restaurant",
    "playground": "leisure=playground",
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