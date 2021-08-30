<!-- 
    @component
    # The Map component.
    This is a full screen component, which effectively acts as the home page for this single page web app. It also contains the scaffolding for the user input box.
    This component manages much of the rendering layer for the leaflet map. 
    It also handles the user's location, either retrieving it from the browser or from a custom city input, and correspondingly updating the map coordinates.
 -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import * as L from 'leaflet';

	import * as Constants from './common/Constants';
    import * as MapHelper from './common/MapHelper';
    import osmtogeojson from './common/osmtogeojson';
    import Recommendation from './components/RecommendationList.svelte';
    import DropdownLocationType from './components/DropdownLocationType.svelte';
    import Infobar from './components/Infobar.svelte';

    export let requestLocationType;

    // Variables used to define the map.
    let map = null;
    var resultLayer = null;
    // Populate with default values.
    let latitude = null;
    let longitude = null;
    let zoom = 14;

    // Variables used to interact with the UI.
    let isLoading = false;
    let cityName = "";
    let mapContainer = null;
    let locationOptions = MapHelper.getDropdownList();
    let locationType =  Constants.locationTypeToOverpassQueryMap[requestLocationType] ? requestLocationType : locationOptions[0];
    let recommendationPayload = null;

    // Query the user's location on mount.
    onMount(async() => {
		await getUserLocation();
	})

    /**
     * Initialize the map.
     * @param latitude the latitude.
     * @param longitude the longitude.
     */
    function createMap(latitude, longitude) {
        let m = L.map(mapContainer, { zoomControl: false }).setView([latitude, longitude], zoom);
        L.tileLayer(
            Constants.Map.urlTemplate,
            {
                attribution: Constants.Map.mapAttribution,
                subdomains: 'abcd',
                maxZoom: 20,
            }).addTo(m);
        return m;
    }

    // Listener to update the map's coordinates any time the latitude or longitude are touched.
    $: if (map != null) {
        map.setView([latitude, longitude], zoom);
        getSuggestion();
    }

    $: if (map == null) {
        if (latitude && longitude) {
            map = createMap(latitude, longitude);
        }
    }

    /**
     * Interpret the custom city input. 
     * If some input is provided, reverse lookup the lat long coordinates. 
     * If no input is provided, try to get the user location from the browser again.
     */
	const customCity = async () => {
        isLoading = true;
        
        // If the user hasn't entered a custom city name, try to find them based on their browser location data.
		if (cityName == "") {
			await getUserLocation();
			return;
		}

		const request = MapHelper.buildGeocodeApiUri(cityName);

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

	// Callback function when user does not share their location, it is blocked, or cannot be found.
	function failLocation(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
		isLoading = false;

        latitude = Constants.Map.defaultLatitude;
        longitude = Constants.Map.defaultLongitude;
	}

    // Get the user's location.
    async function getUserLocation() {
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
			})
            .catch((error) => {
                console.warn(`ERROR Rendering suggestion (${error.code}): ${error.message}`);
		        isLoading = false;
            })
    }

    // Render the suggestion on the map.
    function renderSuggestion(resultAsGeojson) {

        // Clear the result layer between every render.
        if (resultLayer != null) {
            resultLayer.clearLayers();
        }

        // Update the current recommendation.
        recommendationPayload = resultAsGeojson;

        // Render the results layer.
        resultLayer = L.geoJSON(resultAsGeojson, {
            style: function (feature) {
                return {color: "#ff0000"};
            },
            onEachFeature: function (feature, layer) {
                var popupContent = MapHelper.getPopUpBubble(feature);
                layer.bindPopup(popupContent);
            }
        }).addTo(map);
    }

    // Setup the map.
    function mapAction(container) {
        mapContainer = container;
        getUserLocation();
    }
</script>
  
<svelte:head>
    <!-- In the REPL you need to do this. In a normal Svelte app, use a CSS Rollup plugin and import it from the leaflet package. -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin=""/>
    <meta charset="utf-8"/>

</svelte:head>

<style>
    #map {
        height: 100%;
        width: 100%;
    }

    div#controls-options {
        display: grid;
        grid-gap: 8px;
        grid-template-columns: 2fr 1fr;
        padding: 8px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
        border-radius: 5px;
        width: 30vw;
    }

    div.leaflet-bar.title {
        font-size: 30px;
        border: 0px;
    }

    div.controls-container {
        padding: 8px;
    }

    a#source-code {
        text-decoration: none;
        width: auto;
        color: rgb(0, 133, 71);
        background-color: transparent;
        font-size: 16px;
    }

    div.source-code {
        border: 0px;
    }

    div#footer {
        position: absolute;
        bottom: 10px; left: 10px;
    }

    @media only screen and (max-width: 900px) {
        div.controls-container {
            width: auto;
        }

        div#controls-options {
            grid-template-columns: 1fr;
            display: grid;
            grid-gap: 8px;
            padding: 8px;
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
            border-radius: 5px;
            width: 90vw;
        }
    }

</style>
  
<div id="map" use:mapAction>
    <div class="controls-container">
        <div class="leaflet-bar leaflet-control title">Meandering Fellow</div>
        <div id="controls-options" class="leaflet-bar leaflet-control">
            <input id="custom-city" type="text" placeholder="Seattle" bind:value={cityName}>
            <button on:click={customCity}>Find me</button>

            <DropdownLocationType bind:locationType />

            <button on:click={getSuggestion}>I'm feeling lucky</button>
            {#if isLoading}
                <div id="loading-text" transition:fade>Loading...</div>
            {/if}
        </div>
        <Recommendation recommendations={recommendationPayload} />
        <div id="footer" class="leaflet-bar leaflet-control" >
            <div class="leaflet-bar leaflet-control source-code">
                <a target="_blank" id="source-code" href="https://github.com/sabaimran/random-recommender">Source Code</a>
            </div>
            <Infobar />
        </div>
	</div>
</div>