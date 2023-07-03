<script lang="ts">
	import type { Ingredient } from '../../types/data';
	import { afterUpdate, onMount } from 'svelte';
	import axios from 'axios';
	// import Modal from './Modal.svelte';
	// import IngredientForm from './IngredientForm.svelte';

	export let data: any;
	export let ingredients: Ingredient[] = data.ingredients;
	export let form: any;

	// let showModal = false;
	let measurementUnitOptions = [''];
	let searchResults: Ingredient[] = [];
	let searchTerm = '';
	// $: addIngredient = {name: searchTerm}

	const filterIngredients = () => {
		searchResults = ingredients
			.filter((ingredient) => ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()))
			// .concat({ id: null, name: `Add ingredient: ${searchTerm}` });
	};

	const selectIngredient = (ingredient: Ingredient) => {
		const recipeIngredient = {
			...ingredient,
			recipeNumberOf: null,
			recipeMeasurementUnit: ingredient.measurementUnit // <- Pre-selects the ingredient's measurementUnit on the dropdown
		};

		form.set({
			...$form,
			recipeIngredients: [...$form.recipeIngredients, recipeIngredient]
		});

		ingredients = ingredients.filter((i) => i.name !== ingredient.name);
		searchTerm = '';
		searchResults = [];
	};

	const removeIngredient = (ingredient: any) => {
		const filteredIngredients = $form.recipeIngredients.filter(
			(i: any) => i.name !== ingredient.name
		);

		form.set({
			...$form,
			recipeIngredients: filteredIngredients
		});

		ingredients = [...ingredients, ingredient];
	};

	onMount(async () => {
		try {
			const response = await axios.get(`http://localhost:3456/ingredients/measurementUnits`);
			measurementUnitOptions = response.data;
		} catch (error) {
			console.error('Error fetching measurementUnitOptions:', error);
		}
	});
</script>

<div class="autocomplete-input">
	<h3>Ingredients</h3>
	{#if searchTerm.length > 0}
		<div class="autocomplete-dropdown">
			{#each searchResults as result}
				<!-- {#if !result.id}
					<button
						class="autocomplete-dropdown-item"
						on:click|preventDefault={() => (showModal = !showModal)}
					>
						{result.name}
					</button>
				{:else} -->
					<button class="autocomplete-dropdown-item" on:click={() => selectIngredient(result)}>
						{result.name}
					</button>
				<!-- {/if} -->
			{/each}
		</div>
	{/if}
	{#each $form.recipeIngredients as ingredient}
		<div class="flex-container" style="padding-bottom: 0.5em; width: 97.5%">
			<div class="half-width">{ingredient.name}</div>
			<div class="flex-container half-width">
				<div>
					<input
						placeholder="100"
						bind:value={ingredient.recipeNumberOf}
						id="grid-first-name"
						type="text"
					/>
				</div>
				<div>
					<select bind:value={ingredient.recipeMeasurementUnit} name="measurementUnit">
						{#each measurementUnitOptions as measurementUnit}
							<option value={measurementUnit}>{measurementUnit}</option>
						{/each}
					</select>
				</div>
				<button on:click|preventDefault={() => removeIngredient(ingredient)}> remove </button>
			</div>
		</div>
	{/each}
	<input
		type="text"
		placeholder="Search for ingredients..."
		style="margin-bottom: 1em"
		bind:value={searchTerm}
		on:input={filterIngredients}
	/>
</div>

<!-- <Modal bind:showModal>
	<h2 slot="header">Add Ingredient to database:</h2>
	<IngredientForm
		data={data.form}
		ingredient={addIngredient}
		action="/ingredients?/create"
		formId="recipeIngredient"
		{measurementUnitOptions}
	/>
</Modal> -->

<style>
	.autocomplete-input {
		position: relative;
	}

	.autocomplete-dropdown {
		position: absolute;
		width: 93%;
		top: 100%;
		left: 0;
		right: 0;
		background-color: #f1f1f1;
		padding: 0.5rem;
		border-radius: 4px;
		overflow-y: auto;
		z-index: 100;
	}

	.autocomplete-dropdown-item {
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		background-color: #ffffff;
	}

	.autocomplete-dropdown-item:focus {
		background-color: #e0e0e0;
	}

	.flex-container {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	h3 {
		margin: 0.25em 0;
	}

	input {
		width: 95%;
	}

	.half-width {
		width: 50%;
	}
</style>
