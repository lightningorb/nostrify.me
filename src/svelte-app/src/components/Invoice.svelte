<script lang='ts'>
    import {Button} from 'sveltestrap';
    export let bolt11: string;
    let show_invoice: boolean = false;
</script>

{#if show_invoice}
    {bolt11}
{:else}
    <Button on:click={() => show_invoice = true}>Show invoice</Button>
{/if}