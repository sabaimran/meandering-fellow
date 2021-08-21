<script lang="ts">
    import { onMount } from 'svelte';
    import * as L from 'leaflet';
	import * as Constants from './common/Constants';
    import * as MapHelper from './common/MapHelper';
    import osmtogeojson from './common/osmtogeojson';
    import Recommendation from './components/RecommendationList.svelte';
    import { fade } from 'svelte/transition';

    // Variables used to define the map.
    let map = null;
    var resultLayer = null;
    // Populate with default values.
    let latitude = 53.079;
    let longitude = 8.81308;
    let zoom = 14;

    // Variables used to interact with the UI.
    let isLoading = false;
    let cityName = "";
    let mapContainer = null;
    let locationType = { idx: 1, text: "restaurant" };
    let locationOptions = Constants.getDropdownList();
    let recommendationPayload = null;

    // Query the user's location on mount.
    onMount(async() => {
		await getUserLocation();
	})

    // Initialize the map.
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
    }

    // Interpret the custom city input.
	async function customCity() {
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
                failLocation(error);
            })
    }

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

            <select bind:value={locationType}>
                {#each locationOptions as locationOption}
                    <option value={locationOption}>
                        {locationOption.text}
                    </option>
                {/each}
            </select>

            <button on:click={getSuggestion}>I'm feeling lucky</button>
            {#if isLoading}
                <div id="loading-text" transition:fade>Loading...</div>
            {/if}
        </div>
        <Recommendation recommendations={recommendationPayload} />
	</div>
</div>