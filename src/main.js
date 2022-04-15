import App from './App.svelte';

/**
 * The main entry point for the app.
 */
const app = new App({
	target: document.body,
	hydrate: true,
});

export default app;
