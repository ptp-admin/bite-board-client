<script lang="ts">
	import type { PageData } from './$types';
	import type { EmptyIngredient } from '../../../types/ingredients';

	import AddIngredientForm from '../../components/AddIngredientForm.svelte';
	import { searchHandler } from '../../lib/stores/search';
	import { afterUpdate } from 'svelte/internal';
	import _ from 'lodash'

	export let data: PageData;

	let search = ''

	const emptyIngredient: EmptyIngredient = { 
		name: '',
		category: '',
		costPer: 0,
		numberOf: 0,
		measurementUnit: '',
		editable: false
	}

	const handleSearch = () => {
		data.searchableIngredients.filtered = searchHandler(search, data.searchableIngredients)
	}

	afterUpdate(() => {
		handleSearch()
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
	bind:value={search}
	on:input={() => handleSearch()}
/>
<!-- 
	TODO: re-implement these checkboxes
	<b>Sort by:</b>
	<input type=checkbox bind:checked={data.searchableIngredients.sortBy.category}> Category |
	<input type=checkbox bind:checked={$searchStore.sortBy.name}> Name |
	<input type=checkbox bind:checked={$searchStore.sortBy.costPer}> Cost |
	<input type=checkbox bind:checked={$searchStore.sortBy.reverse}> Reverse |
	<input type=checkbox bind:checked={$searchStore.sortBy.showUndefined}>Show Undefined -->


<p><b>{data.searchableIngredients.filtered.length} {data.searchableIngredients.filtered.length === 1 ? 'result' : 'results'}</b></p>

{#each data.searchableIngredients.filtered as ingredient}
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
