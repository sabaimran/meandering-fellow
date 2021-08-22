# Meandering Fellow!

[Meander](https://meandering-fellow.vercel.app/)

It's fruitful to leave some decision-making to randomization in order to satisfy some of our inherent desire to explore. Especially if you've been settled in a city for some time, randomizing some aspects of life can help you get to see some more of those nooks and crannies in the city you don't ordinarily visit. Many of us also suffer from  decision fatigue, wanting to streamline the selection amongst ever-increasing choices.

Meandering Fellow gives you random suggestions without any fore knowledge, based on the area presented in the map. You can look for places like restaurants, coffee shops, or parks. 

All of the logic for this app is purely being processed on the client side :). For any comments or suggestions, add an issue. I'm actively monitoring for feature requests, suggestions, or bugs.

## Deploy locally

```bash
git clone <repository url>
cd random-recommender
npm install
npm run dev
```

Open up [localhost:5000](http://localhost:5000). You should see Meandering Fellow running. Edit a component file in `src`, save it, and the page should automatically reload with your changes.

## See it live!

Deployed with Vercel. [See site](https://meandering-fellow.vercel.app/).

## References
- [Leaflet](https://leafletjs.com/) for rendering the map.
- [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) for pulling the relevant data from Open Street Maps.
- [Svelte](https://svelte.dev/) for the front-end.
- [Geocode.xyz](https://geocode.xyz) used for interperting lat-long coordinates of cities.
- [osmtogeojson](https://tyrasd.github.io/osmtogeojson/) for rendering Overpass results.
- [Sample Javascript + Leaflet project](https://gist.github.com/tyrasd/45e4a6a44c734497e82ccaae16a9c9ea) for reference of the code for API usage.

