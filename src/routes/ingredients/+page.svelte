<script lang="ts">
	import type { PageData } from './$types';
	import type { EmptyIngredient, SearchableIngredient } from '../../../types/ingredients';

	import AddIngredientForm from '../../components/AddIngredientForm.svelte';
	import { searchStore, searchHandler, searchableIngredientsStructure, type SearchableIngredientsStructure } from '../../lib/stores/search';
	import { beforeUpdate } from 'svelte/internal';
	import _ from 'lodash'

	export let data: PageData;

	let searchableIngredients: SearchableIngredientsStructure = { data: [], filtered: []}

	const emptyIngredient: EmptyIngredient = { 
		name: '',
		category: '',
		costPer: 0,
		numberOf: 0,
		measurementUnit: '',
		editable: false
	}

	searchStore.subscribe((store) => {
		searchableIngredients.filtered = searchHandler(store.searchTerm, searchableIngredients)
	});

	beforeUpdate(() => {
		// Create our searchable ingredients object from data returned from the backend
		searchableIngredients = searchableIngredientsStructure(data.ingredients)

		// Apply necessary filtering - this prevents the page from destroying whatever search parameters a user has entered when adding/updating ingredients
		searchableIngredients.filtered = searchHandler($searchStore.searchTerm, searchableIngredients)
	});
</script>

<h2>Add Ingredient</h2>

<AddIngredientForm
	formId={'add'}
	data={data.form}
	action={'?/create'}
	ingredient={emptyIngredient}
/>

<h2>Ingredients Database</h2>

<input
	type="search"
	placeholder="Search ingredients"
	bind:value={$searchStore.searchTerm}
/>
<!-- 
	TODO: re-implement these checkboxes
	<b>Sort by:</b>
	<input type=checkbox bind:checked={data.searchableIngredients.sortBy.category}> Category |
	<input type=checkbox bind:checked={$searchStore.sortBy.name}> Name |
	<input type=checkbox bind:checked={$searchStore.sortBy.costPer}> Cost |
	<input type=checkbox bind:checked={$searchStore.sortBy.reverse}> Reverse |
	<input type=checkbox bind:checked={$searchStore.sortBy.showUndefined}>Show Undefined -->


<p><b>{searchableIngredients.filtered.length} {searchableIngredients.filtered.length === 1 ? 'result' : 'results'}</b></p>

{#each searchableIngredients.filtered as ingredient}
	{#if !ingredient.editable}
	<p>
		{ingredient.name} ({ingredient.category}) - ${ingredient.costPer}/{ingredient.numberOf}{ingredient.measurementUnit}
		<button on:click={() => {
			ingredient.editable = !ingredient.editable}}>edit</button>
	</p>
	{:else}
		<AddIngredientForm
			formId={ingredient.id.toString()}
			data={data.form}
			action={'?/update'}
			{ingredient}
		/>
		<button on:click={() => ingredient.editable = !ingredient.editable}>cancel</button>
	{/if}
{/each}
