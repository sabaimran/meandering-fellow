<!-- 
    @component
    # The App component.
    This is the component that hosts the main routing for the application.
 -->

<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import NavLink from "./components/NavLink.svelte";
    import Map from "./pages/Map.svelte"
    import Home from "./pages/Home.svelte"
  
    // Used for SSR. A falsy value is ignored by the Router.
    export let url = "";

    let DEFAULT_TYPE = "restaurant";

</script>
  
<Router url="{url}">
    <nav id="menu">
      <NavLink to="/map">Map</NavLink>
    </nav>
    <div id="page">
      <Route path="/map/:type" let:params>
        <Map requestLocationType={params.type} />
      </Route>
      <Route path="/map/" >
        <Map requestLocationType={DEFAULT_TYPE} />
      </Route>
      <Route path="/" component="{Home}" />
    </div>
</Router>

<style>
  #menu {
    display: grid;
    gap: 8px;
    padding: 12px;
    grid-template-columns: repeat(4, 1fr);
  }
</style>