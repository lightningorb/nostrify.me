<script type="text/javascript">
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
	    content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
	    return content;
	}
	let content = makeSafeHtml(e.content)
	content = content.replace(/<img/gi, '<img class="img-fluid"');
	let ref = e.tags.filter(x => x[0] == 'e');
	onMount(async () => {
		isOpen = true;
	});
</script>

{#if e}
	<Fade {isOpen} id={e.id}>
		<Card class="mb-3">
			<CardHeader>
				<CardTitle>Note</CardTitle>
				{#if ref.length != 0}
					<small>In reply to: <a href={'/e/'+ref[0][1]}>{ref[0][1].slice(0, 5)}</a>...</small>
				{/if}
			</CardHeader>
			<CardBody>
				<CardSubtitle
					><Time
						id={'time' + e.id}
						relative
						live={1000}
						timestamp={e.created_at * 1000}
					/></CardSubtitle
				>
				<CardText>
					{@html content}
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
