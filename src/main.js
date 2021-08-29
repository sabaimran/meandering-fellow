import Map from './Map.svelte';

/**
 * Retrieve relevant query parameters on app initialization.
 * @returns The query parameter mapping to 'type'
 */
function processQueryParams() {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('type');
}

/**
 * The main entry point for the app.
 */
const app = new Map({
	target: document.body,
	props: {
		requestLocationType: processQueryParams()
	}
});

export default app;