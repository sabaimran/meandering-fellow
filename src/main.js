import App from './App.svelte';
import Map from './Map.svelte';

// const app = new App({
// 	target: document.body,
// 	props: {
// 		title: 'meandering fellow',
// 		cityName: ''
// 	}
// });

const app = new Map({
	target: document.body
});

export default app;