<!-- 
	@component
	# Tooltip
	This handy tooltip component allows you to render some text on hover of a component on an aboslute position, thereby giving it an on hover tooltip capability.
	Adapted from [this Svelte source](https://svelte.dev/repl/3153faf7584d40bd8ddebecf39f24ac1?version=3.42.4).	
 -->
<script>
	export let title = '';
	let isHovered = false;
	let x;
	let y;
	
	function mouseOver(event) {
		isHovered = true;
		x=0;
		y=-400;
	}

	function mouseMove(event) {
		isHovered = true;
		x=0;
		y=-400;
	}
	function mouseLeave() {
		isHovered = false;
	}
</script>

<div
	on:mouseover={mouseOver}
	on:mouseleave={mouseLeave}
	on:mousemove={mouseMove}
	on:focus={mouseMove}>
	<slot />
</div>

{#if isHovered}
	<div style="top: {y}px; left: {x}px;" class="tooltip leaflet-bar leaflet-control">{@html title}</div>
{/if}

<style>
	.tooltip {
		border: 1px solid #ddd;
		box-shadow: 1px 1px 1px #ddd;
		background: white;
		border-radius: 4px;
		padding: 4px;
		position: absolute;
		font-size: 16px;
		width: 300px;
	}
</style>