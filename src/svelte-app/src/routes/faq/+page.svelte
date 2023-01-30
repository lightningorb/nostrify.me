<script>
	//	import { Lottie } from 'lottie-svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import { Col, Container, Row } from 'sveltestrap';
	import Nav from '$lib/components/NostrificationNav.svelte';
</script>

<Nav />

<Container>
	<Row>
		<Col md="8" class="offset-md-2">
			<SvelteMarkdown
				source={`# FAQ



### Q: What does Nostrify mean?

Nostrify means: "To adopt, accept, or include as part of one's own culture."

`}
			/>

			<!-- 			<div style="max-width:200px; margin: auto;">
				<Lottie path="/nostrified.json" speed={1} />
			</div>
 -->
			<SvelteMarkdown
				source={`

In more practical terms, instead of having to go around registering your profiles on Facebook, YouTube, WhatsApp, Instagram, TikTok, Twitter, Snapchat, WeChat, LinkedIn etc.

You simply get nostrified. i.e register in the Nostr universe that is open, free and run by the very capable Bitcoin people. But can basically be run by anyone. With zilch commercial incentives. Nada. Zero.

Think of it as your final "username" + "verified" status, or lightweight (privacy-minded) internet identity that is not owned by big-tech, but that is owned by us: the people.

### Q: What is Nostr?

Nostr is a new decentralized social media network that's currently being built (at the speed of light) by the Bitcoin and Lightning community.

`}
			/>

			<!-- <div style="max-width:200px; margin: auto;"><Lottie path="https://assets1.lottiefiles.com/packages/lf20_mhdn5srg.json" speed={1}/></div> -->

			<SvelteMarkdown
				source={`

### Q: Why should I use Nostr? I'm fine with Facebook / Twitter / Instagram etc.

No advertisers. No algorithms scanning your messages and showing you ads on your Facebook some time later. No goverments twisting the arms of social media companies to amplify some voices whilst muffling others. Run by the people, for the people. If you understand self-sovereignty then you get it. If you don't then we don't have time to convince you.

### Q: Do you nostrify everybody?

Absolutely not. We nostrify slowly and carefully. We vouch for our users... and our users vouch for one another.

That's what you get with us, versus other providers. We won't vouch willy nilly. 

Currently nostrification on nostrify.me is only open to trusted family, friends, colleagues and acquaintances.


### Q: Why should I get Nostrified on Nostrify.me?

- It's a cool domain (Nostrify me. Get it?).

### Q: Who is the creator of Nostr?

A person going by the online pseudonym 'fiatjaf'. You can find him on Twitter [@fiatjaf](https://twitter.com/fiatjaf) and on [_@fiatjaf.com](https://nostrify.me/u/?key=3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d).

### Q: Who funded Nostr?

Jack Dorsey, the founder of Twitter. He gave 14 BTC to fiatjaf so he could speed up development.

### Q: Is Nostr a competitor to existing social media companies?

Yes and no.

Yes because we no longer need Silicon Valley social media companies to have a "Twitter-like" experience. We can simply use Nostr.

No because companies like Google, Facebook and Twitter provide really good "other" services that include:

- Uploading and sharing pictures & videos
- Live video and audio telecommunications

Images and Videos online are kind of a big deal. It's what most users want, and the volume of data hosted and shared is utterly exorbitant and mind-blowing.

Nostr is absolutely nowhere near competing with these kinds of services. It's still at the hardcore nerds and early adopters phase.

### Q: So on Twitter you "tweet" and on Nostr you?

**Note**, which you can use both as a noun and a verb.


`}
			/>

			<!-- <div style="max-width:200px; margin: auto;"><Lottie path="https://assets3.lottiefiles.com/packages/lf20_kYfu7MBfPA.json" speed={1}/></div> -->

			<SvelteMarkdown
				source={`

### Q: So can I follow people, get followed, build a network of people I like?

Yes absolutely.

### Q: Can I send direct messages?

Yes.

### Q: Is direct messaging secure?

Yes as long as nobody has your password (private key). But the network can still see who you're messaging, so it's not ideal, and there may be better platforms for direct messaging (for now - working on it).

### Q: Do i need to use the nostrify.me client?

No. There are much better clients available:

- https://hamstr.to
- https://iris.to
- https://snort.social
- https://github.com/vitorpamplona/amethyst
- etc.

We're just dipping our toes in the client building space to learn and for fun.

`}
			/>
		</Col>
	</Row>
</Container>

<style>
	:global(h3) {
		margin-top: 40px;
		margin-bottom: 20px;
	}
</style>
