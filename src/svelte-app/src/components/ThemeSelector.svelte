<script>
    import { preferences } from '$lib/store.js';
    import { get } from 'svelte/store';
    let themes = [
        { name: "Light", value: "light" },
        { name: "Monokai", value: "monokai" },
        { name: "Cabalt Next", value: "cobaltnext" },
        { name: "Pitch Black", value: "pitchblack" },
        { name: "City Lights", value: "citylights" },
        { name: "Ariake Dark", value: "ariakedark" },
        { name: "OpenAI", value: "openai" }
    ];
    $: selectedTheme = get(preferences).theme_name || 'light';

    function handleChange(event) {
        selectedTheme = event.target.value;
        let p = get(preferences);
        p.theme_name = selectedTheme;
        preferences.set(p);
        window.location.reload();
    }
</script>
<div>
    <label for="theme-selector">Select Theme:</label>
    <select id="theme-selector" on:change={handleChange}>
        {#each themes as theme}
            <option value={theme.value} selected={theme.value === selectedTheme}>{theme.name}</option>
        {/each}
    </select>
</div>