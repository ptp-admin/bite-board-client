<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { styleStore } from '$lib/stores/styles';
	import Modal from './Modal.svelte';

	export let recipe: any;
	export let data: any;

	let showModal = false;

	const { enhance } = superForm(data.form, {
		resetForm: true,
		multipleSubmits: 'prevent'
	});
</script>

<button class={$styleStore.btnError} on:click|preventDefault={() => (showModal = !showModal)}
	>Delete Recipe</button
>

<Modal dialogClass='bg-surface-300 rounded-lg' bind:showModal>
	<h2 slot="header">You are about to delete a recipe:</h2>

	<p>
		{recipe.name}
	</p>

	<form method="POST" action="?/delete" use:enhance slot="button">
		<input type="hidden" name="id" hidden value={recipe.id} />
		<input type="hidden" name="name" hidden value={recipe.name} />
		<button class={$styleStore.btnError}> Delete </button>
	</form>
</Modal>
