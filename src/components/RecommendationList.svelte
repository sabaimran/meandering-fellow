<!-- 
    @component 
    This component manages a list of recommendations being surfaced to the user.
 -->
<script lang="ts">
    import Recommendation from "./Recommendation.svelte";
    import { fly } from 'svelte/transition';

    export let recommendations;

    let isVisible = false;
    $: if (recommendations != null) {
        isVisible = true;
    }
</script>

{#if isVisible}
    <div class="leaflet-bar leaflet-control recommendation-box" transition:fly="{{ y: 20, duration: 2000 }}">
        {#each recommendations.features as feature}
            <Recommendation feature={feature} verbose={false} />
        {/each}
    </div>
{/if}

<style>
    div.leaflet-bar.leaflet-control.recommendation-box {
        margin-top: 16px;
        padding: 8px;
        width: 30vw;
    }

    @media only screen and (max-width: 900px) {
        div.leaflet-bar.leaflet-control.recommendation-box {
            width: 90vw;
        }
    }
</style>