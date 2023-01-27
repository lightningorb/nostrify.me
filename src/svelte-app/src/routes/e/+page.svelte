<script type="text/javascript">
	import Thread from '$lib/components/Thread.svelte';
	let unique = [{}]; // every {} is unique, {} === {} evaluates to false

	function restart() {
		unique = [{}];
	}
</script>

{#each unique as key (key)}
	<Thread {restart} />
{/each}
