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