<script lang="ts">
    import * as L from 'leaflet';
	import { getDropdownList } from './Constants';
    import * as LocationHelper from './LocationHelper';
    import * as MapHelper from './MapHelper';

    // Variables used to define the map.
    let map = null;
    var resultLayer = null;
    let latitude = 53.079;
    let longitude = 8.81308;
    let zoom = 12;

    // Variables used to interact with the UI.
    let isLoading = false;
    let cityName = "";
    let mapContainer = null;
    let locationType = { idx: 1, text: "restaurant" };
    let locationOptions = getDropdownList();
  
    // Initialize the map
    function createMap(latitude, longitude) {
        let m = L.map(mapContainer, { zoomControl: false }).setView([latitude, longitude], zoom);
        L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            {
                attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
            &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
            subdomains: 'abcd',
            maxZoom: 20,
        }).addTo(m);
        return m;
    }

    // Listener to update the map's coordinates any time the latitude or longitude are touched.
    $: if (map != null) {
        map.setView([latitude, longitude], zoom);
    }

    // Interpret the custom city input.
	async function customCity() {
        isLoading = true;
		if (cityName == "") {
			getUserLocation();
			return;
		}

		const request = "https://geocode.xyz/?locate=" + encodeURIComponent(cityName) + "&geoit=json";

		fetch(request)
			.then(response => {
                isLoading = false;
				return response.json();
			})
			.then(response => {
                latitude = response.latt;
                longitude = response.longt;
			})
			.catch((error) => {
				failLocation(error);
			});
	}

    // Callback function when the user has shared their location and it is retrieved successfully.
	function successLocation(position) {
		// Use user's current location to set the view of the map.
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
		isLoading = false;
	}

	// Callback function when user does not share their location or it is blocked. Defaults to Germany.
	function failLocation(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
		isLoading = false;
	}

    // Get the user's location.
    function getUserLocation() {
        isLoading = true;
        navigator.geolocation.getCurrentPosition(successLocation, failLocation);
    }

    /***
     * Overpass Interactions
    */

    // Callback to get the suggestion from the user.
    function getSuggestion() {
		isLoading = true;
		var overpassApiUrl = MapHelper.buildOverpassApiUrl(map, locationType);
		const request = new Request(overpassApiUrl)

		fetch(request)
			.then(response => {
				return response.json();
			})
			.then(response => {
				let osmDataAsJson = response;
				// Get 1 random index from the array.
				if (osmDataAsJson.elements.length > 1) {
					var randomIndices = [...Array(1)].map(() => Math.floor(Math.random() * osmDataAsJson.elements.length));
					var dataToRender = [];
					for (var i=0; i < randomIndices.length; i++) {
						dataToRender.push(osmDataAsJson.elements[randomIndices[i]]);
					}
					osmDataAsJson.elements = dataToRender;
				}
				isLoading = false;
				renderSuggestion(osmtogeojson(osmDataAsJson));
			});
    }

    function renderSuggestion(resultAsGeojson) {
        // Clear the result layer between every render.
        if (resultLayer != null) {
            resultLayer.clearLayers();
        }

        // Render the results layer.
        resultLayer = L.geoJSON(resultAsGeojson, {
            style: function (feature) {
                return {color: "#ff0000"};
            },
            onEachFeature: function (feature, layer) {
                // Construct the pop-up bubbles.
                var popupContent = "<div class=\"pop-up-content-info\">";
                popupContent = popupContent + "<div>@id</div><div>" + feature.properties.type + "/" + feature.properties.id + "</div>";
                var keys = Object.keys(feature.properties.tags);
                keys.forEach(function (key) {
                    popupContent = popupContent + "<div class=\"pop-up-content-info-title\">" + key.replace(':', '- ') + "</div><div>" + feature.properties.tags[key] + "</div>";
                });
                popupContent = popupContent + "<div class=\"pop-up-content-info-title\">" + "Google Maps" + "</div><div>" + "<a href=" + LocationHelper.getGoogleMapsLink(feature) + ">link</a>"+ "</div>";
                popupContent = popupContent + "</div>"
                layer.bindPopup(popupContent);
            }
        }).addTo(map);
    }

    // Setup the map.
    function mapAction(container) {
        mapContainer = container;

        map = createMap(latitude, longitude);
        return {
            destroy: () => {
                map.remove();
            },
        };
    }
</script>
  
<svelte:head>
    <!-- In the REPL you need to do this. In a normal Svelte app, use a CSS Rollup plugin and import it from the leaflet package. -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin=""/>
    <script src="https://unpkg.com/osmtogeojson@2.2.12/osmtogeojson.js"></script>
    <meta charset="utf-8"/>

</svelte:head>

<style>
    #map {
        height: 100%;
        width: 100%;
    }

    .leaflet-bar {
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
        border-radius: 5px;
        width: 30vw;
    }
</style>
  
<div id="map" use:mapAction>
    <div class="controls-container">
        <div id="controls-options" class="leaflet-bar leaflet-control">
            <!-- <form></form> -->
            <input id="custom-city" type="text" placeholder="Seattle" bind:value={cityName}>
            <button on:click={customCity}>Find me</button>

            <select bind:value={locationType}>
                {#each locationOptions as locationOption}
                    <option value={locationOption}>
                        {locationOption.text}
                    </option>
                {/each}
            </select>

            <button on:click={getSuggestion}>I'm feeling lucky</button>
            {#if isLoading}
                <div id="loading-text">Loading...</div>
            {/if}
        </div>
	</div>
</div>