<script lang="ts">
  import type { SuperValidated } from 'sveltekit-superforms';
	import type { NewIngredientSchema } from '../schemas';

	import axios from 'axios';
	import { onMount } from 'svelte';
  import { superForm } from 'sveltekit-superforms/client'

	// TODO update these types
  export let data: SuperValidated<NewIngredientSchema>;
	export let action: string;
	export let formId: string;
	export let ingredient: any;

	const { form, errors, enhance } = superForm(data, {
		id: formId,
		resetForm: true,
		multipleSubmits: 'prevent'
	})

	// Populates form fields with ingredient data
	form.set(ingredient)

	// Fetch the measurementUnitOptions list from the backend
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

<form 
	method="POST" 
	action={action}
	class="bg-gray-200 p-6"
	use:enhance
>
	<input type="hidden" name="id" bind:value={$form.id} />

	<!-- Name -->
	<div>
		<label for="name">Name</label>
		<input type="text" id="name" name="name" bind:value={$form.name} />
		{#if $errors.name}
			<small style="color: red">{$errors.name}</small>
		{/if}
	</div>

	<!-- Category -->
	<div>
		<label for="category">Category</label>
		<input type="text" id="category" name="category" bind:value={$form.category} />
		{#if $errors.category}
			<small style="color: red">{$errors.category}</small>
		{/if}
	</div>

	<!-- Cost -->
	<div>
		<label for="costPer">Cost</label>
		<input type="text" id="costPer" name="costPer" bind:value={$form.costPer} />
		{#if $errors.costPer}
			<small style="color: red">{$errors.costPer}</small>
		{/if}
	</div>

	<!-- Number -->
	<div>
		<label for="numberOf">Number</label>
		<input type="text" id="numberOf" name="numberOf" bind:value={$form.numberOf} />
		{#if $errors.numberOf}
			<small style="color: red">{$errors.numberOf}</small>
		{/if}
	</div>

	<!-- Unit -->
	<div>
		<label for="measurementUnit">Unit</label>
		<select bind:value={$form.measurementUnit} name="measurementUnit">
			{#each measurementUnitOptions as measurementUnit}
				<option value={measurementUnit}>{measurementUnit}</option>
			{/each}
		</select>
		{#if $errors.measurementUnit}
			<small style="color: red">{$errors.measurementUnit}</small>
		{/if}
	</div>

	<button>{$form.id ? 'Update' : 'Add'}</button>

	{#if action === '?/create'}
		<p><b>Preview:</b></p>
		<p>
			{$form.name ? $form.name : 'Ingredient Name'} ({$form.category ? $form.category : 'Category'}) -
			${$form.costPer}/{$form.numberOf}{$form.measurementUnit ? $form.measurementUnit : 'g'}
		</p>
	{/if}
</form>
