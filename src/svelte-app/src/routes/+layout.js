import Fa from 'svelte-fa/src/fa.svelte';
import {
	faHashtag,
	faHouse,
	faBell,
	faUser,
	faEnvelope,
	faCog,
	faBookmark
} from '@fortawesome/free-solid-svg-icons/index.js';

/** @type {import('./$types').LayoutLoad} */
export function load() {
	return {
		sections: [
			{ slug: '', title: 'Home', auth: false, icon: faHouse },
			{ slug: 'profile/', title: 'Profile', auth: false, icon: faCog }
			// { slug: 'explore', title: 'Explore', auth: false, roles: ['user'], icon: faHashtag },
			// { slug: 'explore', title: 'Notification', auth: false, roles: ['user'], icon: faBell },
			// { slug: 'explore', title: 'Messages', auth: false, roles: ['user'], icon: faEnvelope },
			// { slug: 'explore', title: 'Bookmarks', auth: false, roles: ['user'], icon: faBookmark },
			// { title: '<hr/>', auth: false, roles: ['user'] },
		]
	};
}

export let csr = true;
export let ssr = true;
export let prerender = true;
