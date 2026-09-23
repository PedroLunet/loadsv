<script lang="ts" module>
	const paths = {
		github:
			'M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3',
		npm: 'M1.76 0A1.76 1.76 0 0 0 0 1.76v20.48C0 23.21.79 24 1.76 24h20.48c.97 0 1.76-.79 1.76-1.76V1.76C24 .79 23.21 0 22.24 0zm3.37 5.32 13.84.02-.01 13.84h-3.46l.01-10.39h-3.46l-.01 10.38H5.11z',
		file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6M8 13h8m-8 4h5',
		search: 'm21 21-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14',
		copy: 'M8 8V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3M5 8h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2',
		check: 'M20 6 9 17l-5-5',
		play: 'M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5',
		pause: 'M8 4v16m8-16v16',
		reset: 'M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5',
		chevron: 'm9 18 6-6-6-6'
	};

	/** Brand marks are filled; everything else is a 2px stroke. */
	const filled = new Set(['github', 'npm', 'play']);

	export type IconName = keyof typeof paths;
</script>

<script lang="ts">
	let { name, size = 16 }: { name: IconName; size?: number } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	aria-hidden="true"
	fill={filled.has(name) ? 'currentColor' : 'none'}
	stroke={filled.has(name) ? 'none' : 'currentColor'}
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<path d={paths[name]} />
</svg>
