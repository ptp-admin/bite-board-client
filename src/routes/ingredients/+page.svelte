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

<!-- New Ingredient Card -->
<div class="card flex flex-col gap-3 p-5 -m-5 shadow-md bg-surface-600/50">
	<h3 class="mt-0">Add New Ingredient</h3>
	<IngredientForm formId={'add'} data={data.form} action={'?/create'} {measurementUnitOptions} />
</div>

<h3 class="pt-12">Ingredients Database</h3>
<input
	class="input bg-surface-50 border-surface-700 focus:outline-none focus:ring-0 h-8 py-1 px-2.5 rounded-lg w-full"
	type="search"
	placeholder="Search by name or category"
	bind:value={$searchStore.searchTerm}
/>
<div class="py-1 flex flex-row items-center gap-5">
	<b>{$searchStore.filtered.length} {$searchStore.filtered.length === 1 ? 'result' : 'results'}</b> |
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

<div class="space-y-0 shadow-xl rounded-lg">
	<!-- Ingredient Table Header -->
	<div class="pl-3 pr-9 py-2 variant-filled-primary rounded-t-lg flex flex-row justify-between">
		<div class="w-1/3 font-semibold">Ingredient Name</div>
		<div class="w-1/3 font-semibold">Category</div>
		<div class="w-1/3 font-semibold">Cost</div>
	</div>
	<!-- Ingredient Table Contents -->
	{#if $searchStore.filtered.length === 0}
		<div class="px-4 py-2">No results match your filters</div>
	{/if}
	{#each $searchStore.filtered as ingredient, i}
		<div class={i % 2 == 1 ? 'bg-surface-600/50 m-0' : 'm-0'}>
			{#if !ingredient.editable}
				<div class="py-1 pl-3 pr-1 flex flex-row justify-between items-center">
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
					<!-- Edit Ingredient Button -->
					<button
						class="btn btn-sm bg-surface-400 w-8 h-8 rounded-lg variant-soft-surface justify-self-end"
						on:click={() => {
							ingredient.editable = !ingredient.editable;
						}}
					>
						<iconify-icon icon="ic:baseline-edit" />
					</button>
				</div>
			{:else}
				<div class="py-1 px-1">
					{#if ingredient.id}
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
								<!-- Close/ Exit Edit -->
								<button
									class="btn btn-sm bg-surface-400 w-8 h-8 rounded-lg variant-soft-surface"
									on:click={() => (ingredient.editable = !ingredient.editable)}>
										<iconify-icon icon="ic:baseline-close" />
									</button
								>
							</div>
						</IngredientForm>
					{/if}
				</div>
			{/if}
		</div>
	{/each}
	<!-- Ingredient Table Footer -->
	<div class="pl-3 pr-9 py-2 variant-filled-primary rounded-b-lg flex flex-row justify-between">
		<div class="w-1/3 font-semibold">Ingredient Name</div>
		<div class="w-1/3 font-semibold">Category</div>
		<div class="w-1/3 font-semibold">Cost</div>
	</div>
</div>

