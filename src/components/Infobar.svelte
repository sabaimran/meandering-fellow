<script>
    import Tooltip from './Tooltip.svelte';

    let helpText = "<div>Welcome to <b>Meandering Fellow</b>! This is your friendly helper for randomizing small aspects of your day-to-day life.</div> <div>Enter your city in the city input box or share your location for automated rendering. Your location is purely used on the client.</div><div>Use the dropdown to select which types of locations you're interested in finding. When you're ready, click the button to get a randomized recommendation!</div><div>The search space for your recommendation will be whatever the view of the map is. You can scroll in and out to adjust.</div>"
</script>

<Tooltip title={helpText}>
    <div class="leaflet-bar leaflet-control info-text">
        Hover to read about usage of the tool.
    </div>
</Tooltip>

<style>
    div.info-text {
        border: 0px;
        color: rgb(0, 133, 71);
        font-size: 14px;
    }

</style>