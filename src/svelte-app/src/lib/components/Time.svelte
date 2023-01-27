<script type="text/javascript">
	function formatUTC(timecode) {
		const currentTime = Date.now() / 1000;
		const timeDiff = currentTime - timecode;
		const seconds = Math.floor(timeDiff % 60);
		const minutes = Math.floor((timeDiff / 60) % 60);
		const hours = Math.floor((timeDiff / (60 * 60)) % 24);
		const days = Math.floor(timeDiff / (60 * 60 * 24));
		if (days > 0) {
			return `${days}d`;
		} else if (hours > 0) {
			return `${hours}h`;
		} else if (minutes > 0) {
			return `${minutes}m`;
		} else {
			return `${seconds}s`;
		}
	}
	export var utc = 0;
	$: time = formatUTC(utc);
	setInterval(() => (time = formatUTC(utc)), 1000);
</script>

<small>{time}</small>
