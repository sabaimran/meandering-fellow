<script lang="ts">
    import Recommendation from "./Recommendation.svelte";

    export let recommendations;

    let isVisible = false;
    $: if (recommendations != null) {
        isVisible = true;
    }
</script>

{#if isVisible}
    <div class="leaflet-bar leaflet-control recommendation-box">
        {#each recommendations.features as feature}
            <Recommendation feature={feature} verbose={false} />
        {/each}
    </div>
{/if}

<style>
    div.leaflet-bar.leaflet-control.recommendation-box {
        padding: 8px;
        width: 30vw;
    }

    @media only screen and (max-width: 900px) {
        div.leaflet-bar.leaflet-control.recommendation-box {
            width: 90vw;
        }
    }
</style>