<script lang="coffeescript">
    export id = null
    export width = 560
    export height = 315
</script>

<iframe
	{width}
	{height}
	src={'https://www.youtube.com/embed/' + id}
	title="NosTrube video player"
	frameborder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	allowfullscreen
/>
