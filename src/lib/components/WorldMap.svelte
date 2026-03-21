<script lang="ts">
	import { getContext } from 'svelte';
	import { geoPath, geoMercator, type GeoPermissibleObjects } from 'd3-geo';
	import { cn } from '$lib/utils';
	import type { ClassValue } from 'svelte/elements';

	const { data, width, height } = getContext<any>('LayerCake');

	type Props = {
		customColors?: Record<string, string>;
		defaultColor?: string;
		classes?: ClassValue;
	};

	let { customColors = {}, defaultColor = '#fff', classes }: Props = $props();

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
		<path
			d={pathGenerator(feature)}
			fill={customColors[feature.properties.name] || defaultColor}
			stroke="oklch(0.705 0.015 286.067)"
			stroke-width="0.5"
		/>
	{/each}
</g>

<style>
	path {
		transition: fill 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
