<script lang="ts">
	import { getContext } from 'svelte';
	import { geoPath, geoMercator, type GeoPermissibleObjects } from 'd3-geo';
	import { cn } from '$lib/utils';
	import type { ClassValue } from 'svelte/elements';

	const { data, width, height } = getContext<any>('LayerCake');

	type Props = {
		customColors?: Record<string, string>;
		highlights?: Record<string, number>;
		defaultColor?: string;
		classes?: ClassValue;
	};

	let {
		customColors = {},
		highlights = {},
		defaultColor = 'white',
		classes = ''
	}: Props = $props();

	let filteredData = $derived({
		type: 'FeatureCollection',
		features: $data.features.filter((f: any) => f.properties.name !== 'Antarctica')
	});

	let projection = $derived(
		geoMercator().fitExtent(
			[
				[0, 0],
				[$width, $height]
			],
			filteredData as GeoPermissibleObjects
		)
	);

	let pathGenerator = $derived(geoPath(projection));
</script>

<g class={cn('map-group', classes)}>
	{#each filteredData.features as feature}
		{@const highlight = highlights[feature.id] ?? 0}
		{@const baseColor = customColors[feature.properties.name] || defaultColor}
		<path
			d={pathGenerator(feature)}
			style="--path-fill: {highlight > 0
				? `color-mix(in oklch, var(--primary) ${highlight * 100}%, ${baseColor})`
				: baseColor}; stroke: var(--muted-foreground);"
			stroke-width="0.5"
		/>
	{/each}
</g>

<style>
	path {
		fill: var(--path-fill);
		transition: fill 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
