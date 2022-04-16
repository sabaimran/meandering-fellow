# [Meandering Fellow](https://meandering-fellow.vercel.app/)
![GitHub deployments](https://img.shields.io/github/deployments/sabaimran/meandering-fellow/production?label=deploy&logo=vercel&style=flat-square)

## Introduction
> Increase Exploration, Reduce Decisions 🚶‍♀️

It's fruitful to leave some decisions to randomness, it encourages exploration and reduces decision fatigue.

- If you want to explore a city, randomize the next bookstore or park you visit.
  You'll get to see those nooks and crannies of the city you wouldn't ordinarily visit.

- If you want to reduce decision fatigue, and take a break from an ever-increasing set of choices.
  Tradeoff a bit of optimization for exploration and reduced decisions.
  Randomize the next restaurant, bar or coffee shop you visit.


Meandering Fellow gives random location recommendations based on the visible area in the map. You can look for places like restaurants, bars, coffee shops, bookstores or parks.

All of the logic for this app is purely being processed on the client side 🙂. For any comments or suggestions, add an issue. I'm actively monitoring for feature requests, suggestions, or bugs.


## Development

1. **Install**

   ```bash
   git clone <repository url>
   cd random-recommender
   npm install
   npm run dev
   ```

2. **Access**

   Open [localhost:5000](http://localhost:5000) on your browser. You should see Meandering Fellow running.

3. **Develop**

   Edit a component file in `src`, save it, and the page should automatically reload with your changes.


## References
- [Leaflet](https://leafletjs.com/) for rendering the map.
- [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) for pulling the relevant data from Open Street Maps.
- [Svelte](https://svelte.dev/) for the front-end.
- [Geocode.xyz](https://geocode.xyz) used for interperting lat-long coordinates of cities.
- [osmtogeojson](https://tyrasd.github.io/osmtogeojson/) for rendering Overpass results.
- [Sample Javascript + Leaflet project](https://gist.github.com/tyrasd/45e4a6a44c734497e82ccaae16a9c9ea) for reference of the code for API usage.

