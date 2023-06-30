<script lang="ts">
	import type { PageData } from './$types';
	import type { Ingredient } from '../../types/data';

	import IngredientForm from '../../components/IngredientForm.svelte';
	import { createSearchStore, searchHandler, createSearchableIngredients } from '../../lib/stores/search';
	import { beforeUpdate, onDestroy, onMount } from 'svelte/internal';
	import axios from 'axios';
	import _ from 'lodash'
	import DeleteIngredientButton from '../../components/DeleteIngredientButton.svelte';

	export let data: PageData;

	const searchStore = createSearchStore(data.ingredients)

	const unsubscribe = searchStore.subscribe((store) => {
		searchHandler(store)
	})

	// This sections handles updating data in the store correctly on form submission
	beforeUpdate(() => {
		// Transform page data into the same shape as $searchStore.data for comparison
		const pageIngredients = createSearchableIngredients(data.ingredients)
		const storeIngredients = $searchStore.data

		// Check if an ingredient was deleted
		if (storeIngredients.length > pageIngredients.length){
			const deletedIngredient = storeIngredients.filter(storeIngredient => {
				const exists = pageIngredients.some(pageIngredient => pageIngredient.id === storeIngredient.id)
				return !exists
			})[0]
			_.remove(storeIngredients, { id: deletedIngredient.id });
			
			$searchStore.data = storeIngredients
		} else {
			const compareStoreAndPageIngredients = (storeIngredients: Ingredient[], pageIngredients: Ingredient[]) => {
				// Map arrays and return objects with only specific fields for comparison
				const makeIngredientsComparable = (ingredients: Ingredient[]) => {
					return ingredients.map(({	name,	category,	costPer, searchKeywords	}) => {
							return { name, category, costPer, searchKeywords }
				})}

				// Convert arrays to JSON and compare
				return (JSON.stringify(makeIngredientsComparable(storeIngredients)) === JSON.stringify(makeIngredientsComparable(pageIngredients)))
			}
			// Check if an ingredient was added or updated
			if (compareStoreAndPageIngredients(storeIngredients, pageIngredients) === false){
				const minLength = Math.min(pageIngredients.length, storeIngredients.length);

				// Update select properties from pageIngredients to storeIngredients but preserve the state of ingredient.editable for the UI
				_.forEach(_.slice(pageIngredients, 0, minLength), (objectA, index) => {
					_.merge(storeIngredients[index], _.pick(objectA, ['name', 'category', 'costPer', 'searchKeywords']));
				});

				// If pageIngredients is longer, append remaining elements to storeIngredients
				if (pageIngredients.length > storeIngredients.length) {
					const remainingElements = _.slice(pageIngredients, minLength);
					storeIngredients.push(...remainingElements);
				}
				
				// Update the page
				$searchStore.data = storeIngredients
			}
		}
	});

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

	onDestroy(() => unsubscribe())
</script>

<h2>Add Ingredient</h2>

<IngredientForm
	formId={'add'}
	data={data.form}
	action={'?/create'}
	{measurementUnitOptions}
/>

<h2>Ingredients Database</h2>

<input
	type="search"
	placeholder="Search ingredients"
	bind:value={$searchStore.searchTerm}
/>

<b>Sort by:</b>
<input type=checkbox bind:checked={$searchStore.sortBy.category}> Category |
<input type=checkbox bind:checked={$searchStore.sortBy.name}> Name |
<input type=checkbox bind:checked={$searchStore.sortBy.costPer}> Cost |
<input type=checkbox bind:checked={$searchStore.sortBy.reverse}> Reverse |
<input type=checkbox bind:checked={$searchStore.sortBy.showUndefined}>Show Undefined

<p><b>{$searchStore.filtered.length} {$searchStore.filtered.length === 1 ? 'result' : 'results'}</b></p>

{#each $searchStore.filtered as ingredient}
	{#if !ingredient.editable}
	<p>
		{ingredient.name} ({ingredient.category}) - ${ingredient.costPer}/{ingredient.numberOf}{ingredient.measurementUnit}
		<button on:click={() => {
			ingredient.editable = !ingredient.editable}}>edit</button>
	</p>
	{:else}
		<IngredientForm
			formId={ingredient.id.toString()}
			data={data.form}
			action={'?/update'}
			{ingredient}
			{measurementUnitOptions}
		/>
		<DeleteIngredientButton
			{ingredient}
			data={data.form}
			formId={ingredient.id.toString()}
		/>
		<div>
			<button on:click={() => ingredient.editable = !ingredient.editable}>cancel</button>
		</div>
	{/if}
{/each}
