<script lang="ts">
	import L from "leaflet";
	import { locationTypeToOverpassQueryMap } from './constants';
	export let title;
	export let cityName;

	/**
	 * Instantiate new variables.
	 */
	var map = null;
	var resultLayer = null;
	var urlParams = new URLSearchParams(window.location.search);

	var isLoading = false;

	// Setup the map for the first time.
	function instantiateMap(latitude, longitude) {
		map = L.map('map', { zoomControl: false })
			.setView([latitude, longitude], (Number)(urlParams.get("zoom")) || 16);

		L.tileLayer(
			'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			{ 
				maxZoom: 19,
				attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);
	}

	// Generic function for setting the map view.
	function setMap(lat, long) {
		if (map != null) {
			map.setView([lat, long], urlParams.get("zoom") || 16);
		} else {
			instantiateMap(lat, long);
		}
	}

	// Callback function when the user has shared their location and it is retrieved successfully.
	function successLocation(position) {
		// Use user's current location to set the view of the map.
		setMap(position.coords.latitude, position.coords.longitude);
		isLoading = false;
	}

	// Callback function when user does not share their location or it is blocked. Defaults to Germany.
	function failLocation(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
		setMap(53.079, 8.81308);
		isLoading = false;
	}

	// Get the user's live location if they allow it.
	async function getUserLocation() {
		isLoading = true;
		navigator.geolocation.getCurrentPosition(successLocation, failLocation);
	}

	// Interpret the custom city input.
	async function customCity() {
		if (cityName == "") {
			await getUserLocation();
			return;
		}

		const request = "https://geocode.xyz/?locate=" + encodeURIComponent(cityName) + "&geoit=json";

		fetch(request)
			.then(response => {
				return response.json();
			})
			.then(response => {
				setMap(response.latt, response.longt);
			})
			.catch((error) => {
				failLocation(error);
			});
	}

	// Call the Overpass API.
	function buildOverpassApiUrl(map, locationType) {
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

	function getSuggestion(locationType) {
		isLoading = true;
		var overpassApiUrl = buildOverpassApiUrl(map, locationType);
		const request = new Request(overpassApiUrl)

		fetch(request)
			.then(response => {
				console.log(response);
				return response.json();
			})
			.then(response => {
				let osmDataAsJson = response;
				// Get 1 random indices from the array.
				if (osmDataAsJson.elements.length > 1) {
					var randomIndices = [...Array(1)].map(() => Math.floor(Math.random() * osmDataAsJson.elements.length));
					var dataToRender = [];
					for (var i=0; i < randomIndices.length; i++) {
						dataToRender.push(osmDataAsJson.elements[randomIndices[i]]);
					}
					osmDataAsJson.elements = dataToRender;
				}
				isLoading = false;
				// renderSuggestion(osmtogeojson(osmDataAsJson));
			});

		// window.$.get(overpassApiUrl, function (osmDataAsJson) {
		// 	// Get 1 random indices from the array.
		// 	if (osmDataAsJson.elements.length > 1) {
		// 		var randomIndices = [...Array(1)].map(() => Math.floor(Math.random() * osmDataAsJson.elements.length));
		// 		var dataToRender = [];
		// 		for (var i=0; i < randomIndices.length; i++) {
		// 			dataToRender.push(osmDataAsJson.elements[randomIndices[i]]);
		// 		}
		// 		osmDataAsJson.elements = dataToRender;
		// 	}
		// 	isLoading = false;
		// 	renderSuggestion(osmtogeojson(osmDataAsJson));
		// });
	}

	/**
	 * Main execution.
	 */

	// Run function, which is behind an async in order to wait for the client to retrieve the user's location.
	async function run() {
		await getUserLocation();
		(async() => {
			while(map === null) // define the condition as you like
				await new Promise(resolve => setTimeout(resolve, 1000));

			if (map !== null && urlParams.has("type")) {
				var locationType = urlParams.get("type").toLowerCase();
				if (locationType in locationTypeToOverpassQueryMap)
				{
					getSuggestion(locationType);
				}
			}
		})();
	}

	run();

</script>

<div id="map">
	<h1>{title}</h1>
	<div class="leaflet-control-container">
		<div class="leaflet-top leaflet-left">
			<div id="overpass-api-controls" class="leaflet-bar leaflet-control">
				<!-- <input bind:value={title}> -->
				<input label="city" id="query-cityname" placeholder="Seattle" bind:value={cityName}>
				<button on:click={customCity}>Find me</button>
				<input id="city-query-button" type="button" value="Find me">
				<select title="feature type selector" name="query-dropdown-field" id="query-dropdown-field">
					<!-- When adding new option, the value must be in the syntax which Overpass API expects. -->
					<option value="restaurant">Restaurants</option>
					<option value="playground">Parks</option>
					<option value="railway station">Train Stations</option>
					<option value="bar">Bars</option>
					</select>
				<!-- <button on:click="">I'm feeling lucky</button> -->
				<input id="query-button" type="button" value="I'm feeling lucky!">
				{#if isLoading}
					<div id="loading-text">Loading...</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	#map {
		height: 100%;
		width: 100%;
	}

	#overpass-api-controls {
		padding: 10px;
		background-color: rgb(255,255,255);
		opacity: 0.8;
		display: grid;
		grid-gap: 12px;
	}

	#loading-text {
		display: none;
		font-size: 12px;
		font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
	}

	#query-button, #city-query-button {
		background-color: #4285F4;
		opacity: 0.8;
		border: none;
		color: white;
		padding: 4px 12px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		cursor: pointer;
		transition-duration: 0.4s;
		font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
	}

	#query-button:hover, #city-query-button:hover {
		background-color: #4285F4;
		opacity:1;
		color: rgb(0, 0, 0);
	}

	input, select {
		font-size: 16px;
	}

	.leaflet-bar {
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
		border-radius: 5px;
		width: 30vw;
	}

	div.pop-up-content-info {
		display: grid;
		grid-template-columns: 1fr 4fr;
		grid-gap: 4px;
	}

	div.pop-up-content-info-title {
		color:#4285F4;
	}

	@media only screen and (max-width: 500px) {
		.leaflet-bar {
			width: 80vw;
		}
	}
	/* main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #003cff;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	} */
</style>