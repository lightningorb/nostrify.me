/*
 * @Author: lnorb.com
 * @Date:   2023-01-26 14:22:35
 * @Last Modified by:   lnorb.com
 * @Last Modified time: 2023-01-26 18:00:43
 */

import Fa from 'svelte-fa/src/fa.svelte';
import { get } from 'svelte/store';
import { preferences } from '$lib/store.ts';

import { faUser, faBell } from '@fortawesome/free-regular-svg-icons/index.js';

import {
	faTableColumns,
	faHouse,
	faCog,
	faCircleInfo
} from '@fortawesome/free-solid-svg-icons/index.js';

export var load = function () {
	return {
		sections: [
			{
				slug: '/',
				title: 'Home',
				bsIcon: 'house-heart'
			},
			{
				slug: '/notifications/',
				title: 'Notifications',
				icon: faBell
			},
			{
				slug: '/u/',
				title: 'Profile',
				icon: faUser
			},
			{
				slug: '/settings/',
				title: 'Settings',
				bsIcon: 'gear-wide'
			},
			{
				slug: '/register/',
				title: 'Register',
				svg: {
					path: ''
				}
			},
			{
				slug: 'Stacks',
				callback: () => {
					var prefs = get(preferences);
					prefs.stack = !!!prefs.stack;
					preferences.set(prefs);
					location.reload();
				},
				title: 'Stacks',
				bsIcon: 'layout-three-columns'
			}
		]
	};
};

export var csr = true;
export var ssr = true;
export var prerender = true;
