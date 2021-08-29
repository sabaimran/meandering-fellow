import Map from './Map.svelte';

function processQueryParams() {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('type');
}

const app = new Map({
	target: document.body,
	props: {
		requestLocationType: processQueryParams()
	}
});

export default app;