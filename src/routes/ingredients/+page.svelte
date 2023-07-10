<script lang="ts">
	import type { PageData } from './$types';
	import type { Ingredient } from '../../../types/data';
	import IngredientForm from '../../components/IngredientForm.svelte';
	import {
		createSearchStore,
		searchHandler,
		createSearchableIngredients
	} from '../../lib/stores/search';
	import { beforeUpdate, onDestroy, onMount } from 'svelte/internal';
	import axios from 'axios';
	import _ from 'lodash';
	import DeleteIngredientButton from '../../components/DeleteIngredientButton.svelte';

	export let data: PageData;

	const searchStore = createSearchStore(data.ingredients);

	const unsubscribe = searchStore.subscribe((store) => {
		searchHandler(store);
	});

	// This sections handles updating data in the store correctly on form submission
	beforeUpdate(() => {
		// Transform page data into the same shape as $searchStore.data for comparison
		const pageIngredients = createSearchableIngredients(data.ingredients);
		const storeIngredients = $searchStore.data;

		// Check if an ingredient was deleted
		if (storeIngredients.length > pageIngredients.length) {
			const deletedIngredient = storeIngredients.filter((storeIngredient) => {
				const exists = pageIngredients.some(
					(pageIngredient) => pageIngredient.id === storeIngredient.id
				);
				return !exists;
			})[0];
			_.remove(storeIngredients, { id: deletedIngredient.id });

			$searchStore.data = storeIngredients;
		} else {
			const compareStoreAndPageIngredients = (
				storeIngredients: Ingredient[],
				pageIngredients: Ingredient[]
			) => {
				// Map arrays and return objects with only specific fields for comparison
				const makeIngredientsComparable = (ingredients: Ingredient[]) => {
					return ingredients.map(({ name, category, costIsDefined, searchKeywords }) => {
						return { name, category, costIsDefined, searchKeywords };
					});
				};

				// Convert arrays to JSON and compare
				return (
					JSON.stringify(makeIngredientsComparable(storeIngredients)) ===
					JSON.stringify(makeIngredientsComparable(pageIngredients))
				);
			};
			// Check if an ingredient was added or updated
			if (compareStoreAndPageIngredients(storeIngredients, pageIngredients) === false) {
				const minLength = Math.min(pageIngredients.length, storeIngredients.length);

				// Update select properties from pageIngredients to storeIngredients but preserve the state of ingredient.editable for the UI
				_.forEach(_.slice(pageIngredients, 0, minLength), (objectA, index) => {
					_.merge(
						storeIngredients[index],
						_.pick(objectA, ['name', 'category', 'costIsDefined', 'searchKeywords'])
					);
				});

				// If pageIngredients is longer, append remaining elements to storeIngredients
				if (pageIngredients.length > storeIngredients.length) {
					const remainingElements = _.slice(pageIngredients, minLength);
					storeIngredients.push(...remainingElements);
				}

				// Update the page
				$searchStore.data = storeIngredients;
			}
		}
	});

	// Fetch the measurementUnitOptions list from the backend
	let measurementUnitOptions = [''];
	onMount(async () => {
		try {
			const response = await axios.get(`http://localhost:3456/ingredients/measurementUnits`);
			measurementUnitOptions = response.data;
		} catch (error) {
			console.error('Error fetching measurementUnitOptions:', error);
		}
	});

	onDestroy(() => unsubscribe());
</script>

<div class="card p-3 -m-2 bg-gradient-to-br variant-gradient-primary-secondary drop-shadow-2xl">
	<h3>New Ingredient</h3>
	<IngredientForm formId={'add'} data={data.form} action={'?/create'} {measurementUnitOptions} />
</div>

<h3 class="pt-12">Ingredients Database</h3>
<input
	class="input h-8 py-1 px-2.5 rounded-lg w-full"
	type="search"
	placeholder="Search by name or category"
	bind:value={$searchStore.searchTerm}
/>
<div class="py-1 flex flex-row items-center gap-5">
	<b>Sort by:</b>
	<div class="flex flex-row items-center gap-1">
		<input class="checkbox" type="checkbox" bind:checked={$searchStore.sortBy.category} /> Category
	</div>
	<div class="flex flex-row items-center gap-1">
		<input class="checkbox" type="checkbox" bind:checked={$searchStore.sortBy.name} /> Name
	</div>
	<div class="flex flex-row items-center gap-1">
		<input class="checkbox" type="checkbox" bind:checked={$searchStore.sortBy.costIsDefined} /> Cost
	</div>
	<div class="flex flex-row items-center gap-1">
		<input class="checkbox" type="checkbox" bind:checked={$searchStore.sortBy.reverse} /> Reverse
	</div>
	<div class="flex flex-row items-center gap-1">
		<input class="checkbox" type="checkbox" bind:checked={$searchStore.sortBy.showUndefined} />Show
		Undefined
	</div>
</div>

<p>
	<b>{$searchStore.filtered.length} {$searchStore.filtered.length === 1 ? 'result' : 'results'}</b>
</p>

<div class="space-y-0">
	{#each $searchStore.filtered as ingredient, i}
		<div class={i % 2 == 0 ? 'bg-surface-200 m-0 rounded-lg' : 'm-0'}>
			{#if !ingredient.editable}
				<div class="py-1 px-3 flex flex-row justify-between items-center">
					<div class="w-1/3">{ingredient.name}</div>
					<div class="w-1/3">
						{#if ingredient.category}
							{ingredient.category}
						{:else}
							-
						{/if}
					</div>
					<div class="w-1/3">
						{#if ingredient.costIsDefined}
							${ingredient.costPer}/{ingredient.numberOf}{ingredient.measurementUnit}
						{:else}
							-
						{/if}
					</div>
					<button
						class="btn btn-sm h-8 rounded-lg variant-ringed-warning justify-self-end"
						on:click={() => {
							ingredient.editable = !ingredient.editable;
						}}>Edit</button
					>
				</div>
			{:else}
				<div class="py-1 px-1">
					<IngredientForm
						formId={ingredient.id.toString()}
						data={data.form}
						action={'?/update'}
						{ingredient}
						{measurementUnitOptions}
					>
						<DeleteIngredientButton
							{ingredient}
							data={data.form}
							formId={ingredient.id.toString()}
						/>
						<div>
							<button
								class="btn btn-sm h-8 rounded-lg border-error-400 border-2"
								on:click={() => (ingredient.editable = !ingredient.editable)}>Cancel</button
							>
						</div>
					</IngredientForm>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.flex-container {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
</style>
