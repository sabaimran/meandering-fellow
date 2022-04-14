import App from './App.svelte';

/**
 * The main entry point for the app.
 */
const app = new App({
	target: document.body,
	hydrate: true,
});

console.log('hello are you here?');

export default app;