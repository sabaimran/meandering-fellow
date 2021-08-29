<!--
    @component
    The dropdown menu, which can be used to select which type of location to query for.
-->

<script lang="ts">
    import * as MapHelper from '../common/MapHelper';

    export let locationType;

    let locationOptions = MapHelper.getDropdownList();

</script>
<select bind:value={locationType}>
    {#each locationOptions as locationOption}
        <option value={locationOption}>
            {locationOption}
        </option>
    {/each}
</select>