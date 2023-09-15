<script lang="ts">
	import type { Ingredient } from '../../types/data';
	import { onMount } from 'svelte';
	import { styleStore } from '$lib/stores/styles';
	import axios from 'axios';

	export let data: any;
	export let ingredients: Ingredient[] = data.ingredients;
	export let form: any;

	let measurementUnitOptions = [''];
	let searchResults: Ingredient[] = [];
	let searchTerm = '';

	// TODO Come back to this
	const highlightSearchTerm = (searchTerm: string, inputString: string) => {
		var regex = new RegExp(searchTerm, "gi");
		var highlightedString = inputString.replace(regex, `<!-- --><span class="font-bold">$&</span><!-- -->`);
		console.log(highlightedString);
		
		return highlightedString;
	}

	const filterIngredients = () => {
		searchResults = ingredients
			.filter((ingredient) => ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()))
			.concat({ name: `New Ingredient: ${searchTerm}` })
			// .map(ingredient => {
			// 	return {
			// 		...ingredient,
			// 		highlightedName: highlightSearchTerm(searchTerm, ingredient.name)
			// 	}
			// });
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

		if (ingredient.id)
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
	{#if searchTerm.length > 0}
		<div class="autocomplete-dropdown -mt-2">
			{#each searchResults as result}
				{#if result.id}
					<button class={`${$styleStore.btnTertiaryOutline} bg-surface-50 m-0.5`} on:click={() => result.id ? selectIngredient(result) : selectIngredient({name: searchTerm})}>
						{@html result.name}
					</button>
				{:else}
					<button class={`${$styleStore.btnPrimaryOutline} bg-surface-50 m-0.5`} on:click={() => result.id ? selectIngredient(result) : selectIngredient({name: searchTerm})}>
						{@html result.name}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
	{#each $form.recipeIngredients as ingredient}
		<div class="flex pb-1 gap-2">
			<div class="w-1/2 pl-2">{ingredient.name}</div>
			<div class="flex w-1/2 gap-1">
				<input
					class={$styleStore.input}
					placeholder="100"
					bind:value={ingredient.recipeNumberOf}
					type="text"
				/>
				<select class={`${$styleStore.select}`} bind:value={ingredient.recipeMeasurementUnit} name="measurementUnit">
					{#each measurementUnitOptions as measurementUnit}
						<option value={measurementUnit}>{measurementUnit}</option>
					{/each}
				</select>
				<button
					class={`${$styleStore.btnTertiaryOutline} w-8`}
					on:click|preventDefault={() => removeIngredient(ingredient)}
				>
					<iconify-icon icon="ic:baseline-close" />
				</button>
			</div>
		</div>
	{/each}
	<input
		type="text"
		class={`${$styleStore.input} mt-1`}
		placeholder="Search for ingredients..."
		style="margin-bottom: 1em"
		bind:value={searchTerm}
		on:input={filterIngredients}
	/>
</div>

<style>
	.autocomplete-input {
		position: relative;
	}

	.autocomplete-dropdown {
		position: absolute;
		width: 100%;
		top: 100%;
		left: 0;
		right: 0;
		background-color: #f1f1f1;
		padding: 0.5rem;
		border-radius: 4px;
		overflow-y: auto;
		z-index: 100;
	}
</style>
