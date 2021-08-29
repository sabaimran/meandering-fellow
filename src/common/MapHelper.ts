import { locationTypeToOverpassQueryMap } from './Constants';

/***
 * Construct the api request to Overpass to get the nodes to render in the user's map.
 * 
 * @param map The map rendered on the main UI
 * @param locationType The type of location the user has queried for.
 */
export function buildOverpassApiUrl(map, locationType) {
    var overpassQuery =  locationTypeToOverpassQueryMap[locationType];
    var bounds = map.getBounds().getSouth() + ',' + map.getBounds().getWest() + ',' + map.getBounds().getNorth() + ',' + map.getBounds().getEast();
    var nodeQuery = 'node[' + overpassQuery + '](' + bounds + ');';
    var wayQuery = 'way[' + overpassQuery + '](' + bounds + ');';
    var relationQuery = 'relation[' + overpassQuery + '](' + bounds + ');';
    var query = '?data=[out:json][timeout:15][maxsize:1073741824];(' + nodeQuery + wayQuery + relationQuery + ');out body geom;';
    var baseUrl = 'https://overpass-api.de/api/interpreter';
    var resultUrl = baseUrl + query;
    return resultUrl;
}

/***
 * Retrieve the dropdown list based on the mapping of supported queries.
 */
 export function getDropdownList() {
    return Object.keys(locationTypeToOverpassQueryMap);
}

// Construct the API request to Geocode to find the user's location.
export function buildGeocodeApiUri(cityName) {
    return  "https://geocode.xyz/?locate=" + encodeURIComponent(cityName) + "&geoit=json";
}

// Construct the google maps link using the feature's longitude and latitude.
export function getGoogleMapsLink(feature) {
    if (feature.geometry.type == "Polygon") {
        return "https://www.google.com/maps/search/?api=1&query=" + feature.geometry.coordinates[0][0][1] + "%2C" + feature.geometry.coordinates[0][0][0];
    }

    return "https://www.google.com/maps/search/?api=1&query=" + feature.geometry.coordinates[1] + "%2C" + feature.geometry.coordinates[0];
}

// Construct the pop-up bubbles that are used to render the returned result.
export function getPopUpBubble(feature) {
    var popupContent = "<div class=\"pop-up-content-info\">";
    popupContent = popupContent + "<div>@id</div><div>" + feature.properties.id + "</div>";
    var keys = Object.keys(feature.properties);
    keys.forEach(function (key) {
        if (key != "id") {
            popupContent = popupContent + "<div class=\"pop-up-content-info-title\">" + key.replace(':', '- ') + "</div><div>" + feature.properties[key] + "</div>";
        }
    });
    popupContent = popupContent + "<div class=\"pop-up-content-info-title\">" + "Google Maps" + "</div><div>" + "<a href=" + getGoogleMapsLink(feature) + ">link</a>"+ "</div>";
    popupContent = popupContent + "</div>"

    return popupContent;
}