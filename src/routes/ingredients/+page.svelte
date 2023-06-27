<script lang="ts">
	import type { PageData } from './$types';
	import type { EmptyIngredient, Ingredient, SearchableIngredient } from '../../../types/ingredients';

	import AddIngredientForm from '../../components/AddIngredientForm.svelte';
	import { createSearchStore, fakeSearchHandler, createSearchableIngredients } from '../../lib/stores/search';
	import { beforeUpdate } from 'svelte/internal';
	import _ from 'lodash'

	export let data: PageData;

	const emptyIngredient: EmptyIngredient = { 
		name: '',
		category: '',
		costPer: 0,
		numberOf: 0,
		measurementUnit: '',
		editable: false
	}

	const fakeStore = createSearchStore(data.ingredients)

	const unsubscribe = fakeStore.subscribe((store) => {
		fakeSearchHandler(store)
	})

	beforeUpdate(() => {
		const compareStoreAndPageIngredients = (storeIngredients: SearchableIngredient[], pageIngredients: Ingredient[]) => {
			const searchablePageIngredients = createSearchableIngredients(pageIngredients)

			const makeIngredientsComparable = (ingredients: SearchableIngredient[]) => {
				return ingredients.map(({name,
						category,
						costPer,
						searchKeywords}) => {
					return {
						name,
						category,
						costPer,
						searchKeywords
					}
			})}

			return (JSON.stringify(makeIngredientsComparable(storeIngredients)) === JSON.stringify(makeIngredientsComparable(searchablePageIngredients)))
		}

		if(!compareStoreAndPageIngredients($fakeStore.data, data.ingredients))
			$fakeStore.data = createSearchableIngredients(data.ingredients)
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
	bind:value={$fakeStore.searchTerm}
/>

<b>Sort by:</b>
<input type=checkbox bind:checked={$fakeStore.sortBy.category}> Category |
<input type=checkbox bind:checked={$fakeStore.sortBy.name}> Name |
<input type=checkbox bind:checked={$fakeStore.sortBy.costPer}> Cost |
<input type=checkbox bind:checked={$fakeStore.sortBy.reverse}> Reverse |
<input type=checkbox bind:checked={$fakeStore.sortBy.showUndefined}>Show Undefined

<p><b>{$fakeStore.filtered.length} {$fakeStore.filtered.length === 1 ? 'result' : 'results'}</b></p>

{#each $fakeStore.filtered as ingredient}
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
