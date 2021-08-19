import { locationTypeToOverpassQueryMap } from './Constants';

// Construct the API request to Overpass to get the nodes in the user's map.
export function buildOverpassApiUrl(map, locationType) {
    var overpassQuery =  locationTypeToOverpassQueryMap[locationType.text];
    var bounds = map.getBounds().getSouth() + ',' + map.getBounds().getWest() + ',' + map.getBounds().getNorth() + ',' + map.getBounds().getEast();
    var nodeQuery = 'node[' + overpassQuery + '](' + bounds + ');';
    var wayQuery = 'way[' + overpassQuery + '](' + bounds + ');';
    var relationQuery = 'relation[' + overpassQuery + '](' + bounds + ');';
    var query = '?data=[out:json][timeout:15][maxsize:1073741824];(' + nodeQuery + wayQuery + relationQuery + ');out body geom;';
    var baseUrl = 'https://overpass-api.de/api/interpreter';
    var resultUrl = baseUrl + query;
    return resultUrl;
}
