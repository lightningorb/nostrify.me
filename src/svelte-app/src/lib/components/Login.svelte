<script lang="ts">
	import axios from 'axios';
	import { InputGroup, InputGroupText, Input } from 'sveltestrap';
	import { logout } from '$lib/utils.js';
	import { Alert, Button } from 'sveltestrap';
	import { get } from 'svelte/store';
	import { preferences } from '$lib/store.js';

	let reg_alert_visible = false;
	let reg_alert_message = '';
	let login_alert_visible = false;
	let username = '';
	let password = '';
	let rusername = '';
	let rpassword = '';

	function login() {
		login_alert_visible = false;
		const headers = {
			'Content-Type': 'application/json'
		};
		var bodyFormData = new FormData();
		bodyFormData.append('username', username);
		bodyFormData.append('password', password);
		const request = {
			method: 'post',
			url: `https://lnorb.com/token/`,
			data: bodyFormData,
			headers: { 'Content-Type': 'multipart/form-data' }
		};

		axios(request)
			.then((response) => {
				let p = get(preferences);
				console.log(p);
				p.access_token = response.data.access_token;
				p.role = response.data.role;
				preferences.set(p);
			})
			.catch((error) => {
				login_alert_visible = true;
			});
	}

	function register() {
		reg_alert_visible = false;
		const headers = {
			'Content-Type': 'application/json'
		};
		let body = JSON.stringify({ username: rusername, password: rpassword });
		axios
			.post(`https://lnorb.com/api/auth/users/register/`, body, { headers: headers })
			.then(function (response) {
				let p = get(preferences);
				p.access_token = response.data.access_token;
				preferences.set(p);
			})
			.catch(function (error) {
				reg_alert_message = error.response.data.detail;
				reg_alert_visible = true;
			});
	}
</script>

{#if $preferences.access_token != ''}
	<h1>You're logged in</h1>
	<!-- <button on:click={logout}>Log out</button> -->
{:else}
	<h1>Login</h1>
	<InputGroup>
		<table width="400px">
			<tr>
				<td>
					<InputGroupText>username</InputGroupText>
				</td>
				<td>
					<Input placeholder="username" bind:value={username} />
				</td>
			</tr>
			<tr>
				<td>
					<InputGroupText>password</InputGroupText>
				</td>
				<td>
					<Input type="password" placeholder="password" bind:value={password} />
				</td>
			</tr>
		</table>
	</InputGroup>
	<br />
	<Button on:click={login}>Log in</Button>
	<br />
	<br />
	<Alert color="danger" isOpen={login_alert_visible} toggle={() => (login_alert_visible = false)}>
		Error: <code>Could not log in</code>.
	</Alert>

	<h1>Register</h1>

	<InputGroup>
		<table width="400px">
			<tr>
				<td>
					<InputGroupText>Username</InputGroupText>
				</td>
				<td>
					<Input placeholder="username" bind:value={rusername} />
				</td>
			</tr>
			<tr>
				<td>
					<InputGroupText>Password</InputGroupText>
				</td>
				<td>
					<Input type="password" placeholder="password" bind:value={rpassword} />
				</td>
			</tr>
		</table>
	</InputGroup>
	<Alert color="danger" isOpen={reg_alert_visible} toggle={() => (reg_alert_visible = false)}>
		Error: <code>{reg_alert_message}</code>.
	</Alert>
	<br />
	<Button on:click={register}>Register</Button>
{/if}

<br />
<br />
