
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

<button class="btn btn-sm w-8 h-8 rounded-lg bg-error-400" on:click={() => showModal = !showModal}>
	<iconify-icon icon="ic:baseline-delete" />
</button>

<Modal dialogClass='w-full' bind:showModal>
	<h3 slot="header">
		Are you sure? You are about to delete:
	</h3>

	<div class="px-3 mt-4 flex flex-row justify-between">
		<div class="w-1/3 font-medium">Ingredient Name</div>
		<div class="w-1/3 font-medium">Category</div>
		<div class="w-1/3 font-medium">Cost</div>
	</div>
	<div class="bg-surface-200 mb-6 rounded-lg py-2 px-3 flex flex-row justify-between">
		<div class="w-1/3">{ingredient.name}</div>
		<div class="w-1/3">{ingredient.category ? ingredient.category : '-'}</div>
		<div class="w-1/3">{ingredient.costIsDefined ? `$${ingredient.costPer}/${ingredient.numberOf}${ingredient.measurementUnit}` : '-'}</div>
	</div>

	<form
		method="POST"
		action="?/delete"
		use:enhance
		slot="button"
	>
		<input type="hidden" name ="id" hidden value={ingredient.id}>
		<input type="hidden" name ="name" hidden value={ingredient.name}>
		<button class="btn btn-sm h-8 rounded-lg bg-error-400">
			Delete
		</button>
	</form>
</Modal>