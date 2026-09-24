<script lang="ts">
	import { resolve } from '$app/paths';
	import { Spark } from '$lib';
</script>

<a
	href={resolve('/')}
	class="flex w-max items-center gap-2 rounded-md px-2 py-1 text-[15px] font-semibold tracking-tight"
>
	<!-- The library's own Spark spinner, running: the mark is the product. -->
	<Spark size={18} color="var(--color-svelte)" />
	loadsv
</a>
