<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte/internal';
	import { superForm } from 'sveltekit-superforms/client';
	import axios from 'axios';
	import Modal from './Modal.svelte';

	export let data: PageData;	

	let showModal = false;

	const { form, message, enhance, errors } = superForm(data.form, {
		resetForm: true
	});

	let measurementUnitOptions = ['']
	onMount(async () => {
		try {
			const response = await axios.get(`http://localhost:3456/ingredients/measurementUnits`);
			measurementUnitOptions = response.data;		
		} catch (error) {
			console.error('Error fetching measurementUnitOptions:', error);
		}
	});
</script>

{#if $message}{$message}{/if}

<button on:click={() => (showModal = true)}>Add Ingredient</button>

<Modal {form} bind:showModal>
	<h2 slot="header">
		{#if $form.id}Edit Ingredient{:else}Add Ingredient{/if}
	</h2>

	<form 
	method="POST"
	use:enhance
>
	<input type="hidden" name="id" bind:value={$form.id} />

	<!-- Name -->
	<div>
		<label for="name">Name</label>
		<input type="text" name="name" bind:value={$form.name} />
		{#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
	</div>

	<!-- Category -->
	<div>
		<label for="category">Category</label>
		<input type="text" name="category" bind:value={$form.category} />
		{#if $errors.category}<span class="invalid">{$errors.category}</span>{/if}
	</div>

	<!-- Cost -->
	<div>
		<label for="costPer">Cost</label>
		<input type="text" name="costPer" bind:value={$form.costPer} />
		{#if $errors.costPer}<span class="invalid">{$errors.costPer}</span>{/if}
	</div>

	<!-- Number -->
	<div>
		<label for="numberOf">Number</label>
		<input type="text" name="numberOf" bind:value={$form.numberOf} />
		{#if $errors.numberOf}<span class="invalid">{$errors.numberOf}</span>{/if}
	</div>

	<!-- Unit -->
	<div>
		<label for="measurementUnit">Unit</label>
		<select name="measurementUnit" value={$form.measurementUnit} >
			{#each measurementUnitOptions as measurementUnit}
				<option value={measurementUnit}>{measurementUnit}</option>
			{/each}
		</select>
		{#if $errors.measurementUnit}<span class="invalid">{$errors.measurementUnit}</span>{/if}
	</div>

	<button on:click={() => (showModal = false)}>Save Changes</button>
	{#if $form.id}
		<button name="delete">Delete</button>
	{/if}
</form>
	
</Modal>

<div>
	{#each data.ingredientDB as ingredient}
		<p>{ingredient.name} <a href="/ingredient-modal/{ingredient.id}"><button on:click={() => (showModal = true)}>Edit</button>
		</a>
	</p>
	{/each}
</div>