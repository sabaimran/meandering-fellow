<!-- 
    @component
    # The App component.
    This is the component that hosts the main routing for the application.
 -->

<script lang="js">
    import { Router, Route, Link } from "svelte-routing";
    import Map from "./pages/Map.svelte"
    import Home from "./pages/Home.svelte"
  
    // Used for SSR. A falsy value is ignored by the Router.
    export let url = "";

    let DEFAULT_TYPE = "restaurant";

</script>
  
<Router url="{url}">
    <nav id="titlebar">
      <div id="title">
        <Link to="/" class="titlebar">Meandering Fellow</Link>
      </div>
      <div id="menu">
        <Link to="/map" class="titlebar">Map</Link>
      </div>
    </nav>
    <div id="page">
      <Route path="map/:type" let:params>
        <Map requestLocationType="{params.type}"/>
      </Route>
      <Route path="map/" let:params>
        <Map requestLocationType={DEFAULT_TYPE} />
      </Route>
      <Route path="/" component="{Home}" />
    </div>
</Router>

<style>
  #titlebar {
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-template-areas: "title menu";
    grid-gap: 8px;
    align-items: left;
    justify-items: left;
    background-color: #3ee4c0;
    padding: 4px 32px;
    border-bottom: 1px solid #d3d3d3;
  }

  #title {
    grid-area: title;
    align-self: left;
    justify-self: left;

    font-size: 36px;
    text-decoration: none;
    font-weight: lighter;
  }

  #menu {
    grid-area: menu;
    align-self: right;
    justify-self: right;

    display: grid;
    gap: 8px;
    padding: 12px;
    grid-template-columns: repeat(1, 1fr);

    font-size: 20px;
  }
</style>