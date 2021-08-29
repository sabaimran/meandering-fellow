<!--
    @component
    # The dropdown menu
    This component is used to select which type of location to query for. It should come pre-populated with the starter selected option.
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