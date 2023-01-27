<script lang="ts">
	export var text = '';
</script>

{#each text.split('\n') as line}
	{line}<br />
{/each}
