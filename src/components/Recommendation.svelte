<!-- 
    @component 
    This represents an individual recommendation component that pops up when a recommendation is surfaced to the user. 
    This component is not rendered within the map layer itself, but rather as an overlay on top of it.
 -->
<script lang="ts">
    import { getGoogleMapsLink } from "../common/MapHelper";
    import * as Constants from '../common/Constants';

    export let feature;
    export let verbose;

    let properties;

    $: properties = feature['properties'];

    let isVisible = false;
    $: if (feature != null) {
        isVisible = true;
    }

    function constructStreetAddress(properties) {
        let houseNumber = properties[Constants.OSMNode.Properties.houseNumber];
        let streetAddr = properties[Constants.OSMNode.Properties.street];
        return (houseNumber ? houseNumber + " " : "") + (streetAddr ?? "");
    }

    function constructGeographicAddress(properties) {
        let cityText = properties[Constants.OSMNode.Properties.city];
        let stateText = properties[Constants.OSMNode.Properties.state];
        let countryText = properties[Constants.OSMNode.Properties.country];

        // Add a comma after the city if there's a city and either a state or country.
        if (cityText) {
            cityText+=(stateText || countryText) ? ", " : "";
        }

        // Add a comma after the state if there's a state and a country.
        if (stateText) {
            stateText+=(countryText) ? ", " : "";
        }

        return (cityText ?? "") + (stateText ?? "") + (countryText ?? "");
    }

    function hasWebsite(properties) {
        return properties[Constants.OSMNode.Properties.website] || properties[Constants.OSMNode.Properties.contactWebsite];
    }

    function propertyOrEmpty(property) {
        return property ?? "";
    }

</script>

{#if isVisible}
    <div class="recommendation-box-item container">
        <div class="recommendation-box-item property-summary" >
            <p class="recommendation-box-item property-summary name">
                {properties[Constants.OSMNode.Properties.nameProp]}
            </p>
            {#if hasWebsite(properties)}
                <p class="recommendation-box-item property-summary website">
                    <a class="property" target="_blank" href={properties[Constants.OSMNode.Properties.website ?? properties[Constants.OSMNode.Properties.contactWebsite]]}>
                        Website
                    </a>
                </p>
            {/if}
            <p class="recommendation-box-item property-summary website">
                {propertyOrEmpty(properties[Constants.OSMNode.Properties.phone])}
            </p>
            <p class="recommendation-box-item property-summary street-address">
                {constructStreetAddress(properties)}
            </p>
            <p class="recommendation-box-item property-summary geographic-address">
                {constructGeographicAddress(properties)}
            </p>
            <div class="center-align">
                <p class="recommendation-box-item property-summary map-link">
                    <a class="property map-link" target="_blank" href={getGoogleMapsLink(feature)}>Go!</a>
                </p>
            </div>
        </div>
        {#if verbose}
            <div class="recommendation-box-item property-list">
                {#each Object.keys(properties) as property}
                    <div class="recommendation-box property key">
                        {property}
                    </div>
                    <div class="recommendation-box property value">
                        {feature['properties'][property]}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
{/if}

<style>
    div.recommendation-box-item.property-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        background-color: #f3faf5;
        font-size: 16px;
        grid-gap: 8px;
    }

    a.property, a.property:hover {
        text-decoration: none;
        color:navy;
        background-color: transparent;
    }

    a.property.map-link {
        display: inline-block;
    }

    div.recommendation-box.property {
        padding: 4px;
    }

    div.recommendation-box-item.property-summary {
        font-size: 16px;
        padding-left: 4px;
        padding-right: 2px;
    }

    p.recommendation-box-item.property-summary {
        line-height: 18px;
    }

    p.recommendation-box-item.property-summary.name {
        font-size: 18px;
        font-weight: bold;
    }

    div.recommendation-box-item.container {
        background-color: #f3faf5;
        padding: 8px;
    }

    p.recommendation-box-item.property-summary.map-link {
        background-color: #3ee4c0;
    }

    a.map-link {
        color: #e7fcec;
    }

    a.map-link:hover {
        color: #0d3a17;
    }

    div.center-align {
        text-align: center;
    }

</style>