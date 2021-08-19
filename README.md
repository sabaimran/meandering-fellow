# Random Place Recommender Svelte app

Built with the Svelte project template at https://github.com/sveltejs/template.

It's fruitful to leave some decision-making to randomization in order to leverage some of our capability to explore. Especially if you're living in a city you've been in for a while, randomizing a restaurant to eat out, or a park to visit, can help you get to see some more of those nooks and crannies in the city you don't ordinarily visit.

## Get started

Install the dependencies...

```bash
cd svelte-random-recommender
npm install
```

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.


## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

## Deploying to the web

### With [Vercel](https://vercel.com)

Install `vercel` if you haven't already:

```bash
npm install -g vercel
```

Then, from within your project folder:

```bash
cd public
vercel deploy --name my-project
```
#### Deployed

Deployed with Vercel to https://svelte-random-recommender.vercel.app/

## References
- https://geocode.xyz for intepreting lat-long coordinations of cities
- https://leafletjs.com/ for rendering the map
- https://wiki.openstreetmap.org/wiki/Overpass_API for pulling the relevant data from Open Street Maps
- https://gist.github.com/tyrasd/45e4a6a44c734497e82ccaae16a9c9ea for reference of the code for API usage

