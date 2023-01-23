<script lang="coffeescript">
    import { preferences } from '$lib/store.ts'
    import { get } from 'svelte/store'
    themes = [
            { name: "Light", value: "light" },
            { name: "Monokai", value: "monokai" },
            { name: "Cabalt Next", value: "cobaltnext" },
            { name: "Pitch Black", value: "pitchblack" },
            { name: "City Lights", value: "citylights" },
            { name: "Ariake Dark", value: "ariakedark" },
            { name: "OpenAI", value: "openai" }
        ]
    prefs = {}
    preferences.subscribe (x) -> prefs = x
    handleChange = (event) -> preferences.update ({theme_name, ...rest}) -> {theme_name: event.target.value, ...rest}
</script>

<div>
	<label for="theme-selector">Select Theme:</label>
	<select id="theme-selector" on:change={handleChange}>
		{#each themes as theme}
			<option value={theme.value} selected={theme.value === prefs.theme_name}>{theme.name}</option>
		{/each}
	</select>
</div>
