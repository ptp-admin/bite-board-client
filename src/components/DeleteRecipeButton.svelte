
<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client'
	import Modal from './Modal.svelte';

	export let recipe: any
  export let data: any

	let showModal = false;

	const { enhance } = superForm(data.form, {
		resetForm: true,
		multipleSubmits: 'prevent'
	})
</script>

<button on:click={() => showModal = !showModal}>Delete</button>

<Modal bind:showModal>
	<h2 slot="header">
		You are about to delete:
	</h2>

	<p>
		{recipe.name}
	</p>

	<form
		method="POST"
		action="?/delete"
		use:enhance
		slot="button"
	>
		<input type="hidden" name ="id" hidden value={recipe.id}>
		<input type="hidden" name ="name" hidden value={recipe.name}>
		<button>
			Delete
		</button>
	</form>
</Modal>