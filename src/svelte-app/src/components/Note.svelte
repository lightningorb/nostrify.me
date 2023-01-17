<script type="text/javascript">
    import SvelteMarkdown from 'svelte-markdown'
	import {
		Button,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		CardSubtitle,
		CardText,
		CardTitle,
		Fade
	} from 'sveltestrap';
	import Time from 'svelte-time';
	import { onMount } from 'svelte';

	let isOpen = false;
	export let event;
	let e = event;
	function makeSafeHtml(content) {
		const imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;
		content = content.replace(imgRegex, '<img src="$1" alt="image">');
		content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
		return content;
	}
	let source = makeSafeHtml(e.content);
	source = source.replace(/<img/gi, '<img class="img-fluid"');
	let ref = e.tags.filter((x) => x[0] == 'e');
	onMount(async () => {
		isOpen = true;
	});
</script>

{#if e}
	<Fade {isOpen} id={e.id}>
		<Card class="mb-3">
			<CardHeader>
				<Time id={'time' + e.id} relative live={1000} timestamp={e.created_at * 1000} />
				{#if ref.length != 0}
					<small>In reply to: <a href={'/e/' + ref[0][1]}>{ref[0][1].slice(0, 5)}</a>...</small>
				{/if}
			</CardHeader>
			<CardBody>
				<!-- <CardSubtitle></CardSubtitle> -->
				<CardText>
					<SvelteMarkdown {source} />
					<!-- {content} -->
				</CardText>
			</CardBody>
			<CardFooter>
				<small>User Identity: {e.pubkey.slice(0, 10)}...</small>
				<br />
				<small>Note Identity: {e.id.slice(0, 10)}...</small>
			</CardFooter>
		</Card>
	</Fade>
{/if}
