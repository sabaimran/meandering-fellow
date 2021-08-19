// Construct the google maps link using the feature's longitude and latitude.
export function getGoogleMapsLink(feature: any) {
    return "https://www.google.com/maps/search/?api=1&query=" + feature.geometry.coordinates[1] + "%2C" + feature.geometry.coordinates[0];

}
