
<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client'
	import Modal from './Modal.svelte';

	export let ingredient: any
  export let data: any
	export let formId: string;

	let showModal = false;

	const { enhance } = superForm(data, {
		id: formId,
		resetForm: true,
		multipleSubmits: 'prevent'
	})
</script>

<button on:click={() => showModal = !showModal}>delete</button>

<Modal bind:showModal>
	<h2 slot="header">
		You are about to delete:
	</h2>

	<p>
		{ingredient.name ? ingredient.name : 'Ingredient Name'} ({ingredient.category ? ingredient.category : 'Category'}) -
		${ingredient.costPer}/{ingredient.numberOf}{ingredient.measurementUnit ? ingredient.measurementUnit : 'g'}
	</p>

	<form
		method="POST"
		action="?/delete"
		use:enhance
		slot="button"
	>
		<input type="hidden" name ="id" hidden value={ingredient.id}>
		<input type="hidden" name ="name" hidden value={ingredient.name}>
		<button>
			delete
		</button>
	</form>
</Modal>