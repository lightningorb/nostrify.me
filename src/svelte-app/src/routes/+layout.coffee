import Fa from 'svelte-fa/src/fa.svelte'
import { faHouse, faCog } from '@fortawesome/free-solid-svg-icons/index.js'
export load = ->
	sections: [
		{ slug: '', title: 'Home', icon: faHouse }
		{ slug: 'profile/', title: 'Profile', icon: faCog }
	]
export csr = true
export ssr = true
export prerender = true