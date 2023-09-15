<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { styleStore } from '$lib/stores/styles';
	import Modal from './Modal.svelte';

	export let ingredient: any;
	export let data: any;
	export let formId: string;

	let showModal = false;

	const { enhance } = superForm(data, {
		id: formId,
		resetForm: true,
		multipleSubmits: 'prevent'
	});
</script>

<button class={$styleStore.btnError} on:click={() => (showModal = !showModal)}>
	<iconify-icon icon="ic:baseline-delete" />
</button>

<Modal bind:showModal>
	<h3 slot="header">Are you sure? You are about to delete:</h3>

	<div class="px-1 mt-4 flex flex-row justify-between">
		<div class={`${$styleStore.label} w-1/3`}>Ingredient Name</div>
		<div class={`${$styleStore.label} w-1/3`}>Category</div>
		<div class={`${$styleStore.label} w-1/3`}>Cost</div>
	</div>
	<div class={`${$styleStore.preview} mb-4`}>
		<div class="w-1/3">{ingredient.name}</div>
		<div class="w-1/3">{ingredient.category ? ingredient.category : '-'}</div>
		<div class="w-1/3">
			{ingredient.costIsDefined
				? `$${ingredient.costPer}/${ingredient.numberOf}${ingredient.measurementUnit}`
				: '-'}
		</div>
	</div>

	<form method="POST" action="?/delete" use:enhance slot="button">
		<input type="hidden" name="id" hidden value={ingredient.id} />
		<input type="hidden" name="name" hidden value={ingredient.name} />
		<button class={$styleStore.btnError}> Delete </button>
	</form>
</Modal>
