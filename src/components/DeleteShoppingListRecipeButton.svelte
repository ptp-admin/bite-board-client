<script lang="ts">
	import { enhance } from '$app/forms';

	// import { superForm } from 'sveltekit-superforms/client';

	import { styleStore } from '$lib/stores/styles';
	import Modal from './Modal.svelte';

	export let recipe: any;
	export let shoppingList: any;

	let showModal = false;
</script>

<button class={$styleStore.btnError} on:click|preventDefault={() => (showModal = !showModal)}
	><iconify-icon icon="ic:baseline-delete" /></button
>

<Modal dialogClass="bg-surface-300 rounded-lg" bind:showModal>
	<h2 slot="header">You are about to delete a recipe from your shopping list:</h2>

	<p>
		{recipe.name}
	</p>

	<form method="POST" action="?/deleteRecipe" use:enhance slot="button">
		<input type="hidden" name="shoppingListId" hidden value={shoppingList.id} />
		<input type="hidden" name="recipeId" hidden value={recipe.id} />
		<button class={$styleStore.btnError} on:click={() => showModal = false}> Delete </button>
	</form>
</Modal>
