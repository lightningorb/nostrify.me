<script lang="coffeescript">
  import { Popover } from 'sveltestrap';
  export id = null
  export note_id = ''
  export content = ''
  export kind = ''
  export tags = '[]'
  export pubkey = ''
  export created_at = 0
</script>

<Popover class="meta-popover" target={id}>
	<div slot="title">Metadata</div>
	<code style="font-size: 0.8em;">
		{'{'}<br />
		&nbsp;&nbsp;&nbsp;"id": "{note_id}",<br />
		&nbsp;&nbsp;&nbsp;"pubkey": "{pubkey}",<br />
		&nbsp;&nbsp;&nbsp;"created_at": "{created_at}",<br />
		&nbsp;&nbsp;&nbsp;"kind": "{kind}",<br />
		&nbsp;&nbsp;&nbsp;"content": "{content}",<br />
		&nbsp;&nbsp;&nbsp;"sig": "{sig}",<br />
		&nbsp;&nbsp;&nbsp;"tags": "{tags}",<br />
		{'}'}
	</code>
</Popover>
