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
				title: '',
				bsIcon: 'house-heart'
			},
			{
				slug: '/notifications/',
				title: '',
				icon: faBell
			},
			{
				slug: '/u/',
				title: '',
				icon: faUser
			},
			{
				slug: '/settings/',
				title: '',
				bsIcon: 'gear-wide'
			},
			// {
			// 	slug: '/about/',
			// 	title: '',
			// 	bsIcon: 'info-circle'
			// },
			{
				slug: '/register/',
				title: '',
				svg: {
					path: ''
				}
			},
			{
				slug: '',
				callback: () => {
					var prefs = get(preferences);
					prefs.stack = !!!prefs.stack;
					preferences.set(prefs);
				},
				title: '',
				bsIcon: 'layout-three-columns'
			}
		]
	};
};

export var csr = true;
export var ssr = true;
export var prerender = true;
