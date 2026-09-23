<script lang="ts">
	import { resolve } from '$app/paths';
	import { Classic } from '$lib';
</script>

<a
	href={resolve('/')}
	class="flex w-max items-center gap-2 rounded-md px-2 py-1 text-[15px] font-semibold tracking-tight"
>
	<!-- The library's own Classic spinner, held still: the mark is the product. -->
	<Classic size={18} playState="paused" color="var(--color-svelte)" />
	loadsv
</a>
