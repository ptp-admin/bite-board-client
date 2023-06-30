<script lang="ts">
	import type { Ingredient } from "../../types/data";
	import { onDestroy } from "svelte";
	import { writable } from "svelte/store";
	export let data;
  export let ingredients: Ingredient[] = data.ingredients;
	export let form: any;

	const selectedIngredients = writable([])
  let searchResults: RecipeIngredient[] = []; // TODO fix this type
  let searchTerm = "";
  let focusedIndex = -1;

	form.set({
		name: $form.name,
		method: $form.method,
		servings: $form.servings,
		recipeIngredients: []
	}) // fill this array with new ingredients

	onDestroy(() =>
		selectedIngredients.set([])
	);

  function filterIngredients() {
    searchResults = ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    focusedIndex = -1; // Reset focused index when filtering results
  }

  function selectIngredient(ingredient: Ingredient) {
		const recipeIngredient = {
			name: ingredient.name,
			id: ingredient.id,
			recipeNumberOf: null,
			recipeMeasurementUnit: ''
		}
		form.set({
			name: $form.name,
			method: $form.method,
			servings: $form.servings,
			recipeIngredients: [...$form.recipeIngredients, recipeIngredient]
		})
		console.log($form);

		ingredients = ingredients.filter(i => i.name !== ingredient.name)
    searchTerm = "";
    searchResults = [];
    focusedIndex = -1; // Reset focused index after selection
  }

	function removeIngredient(ingredient) {
		console.log($form.recipeIngredients.filter(i => i.name !== ingredient.name));
		
		form.set({recipeIngredients: $form.recipeIngredients.filter(i => i.name !== ingredient.name)});
    // selectedIngredients.set($selectedIngredients.filter(i => i.name !== ingredient.name));
		ingredients = [...ingredients, ingredient];
  }
</script>

<style>
  .autocomplete-input {
    position: relative;
  }

  /* .autocomplete-input input {
    padding: 0.75rem;
  } */

  .autocomplete-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #f1f1f1;
    padding: 0.5rem;
    border-radius: 4px;
    max-height: 200px;
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
		width: 100%
	}
</style>

<div class="autocomplete-input">
  <label for="grid-password">
		Ingredients
	</label>
  {#if searchResults.length > 0}
    <div class="autocomplete-dropdown">
      {#each searchResults as result, index (result.id)}
        <button
          class="autocomplete-dropdown-item"
          on:click={() => selectIngredient(result)}
          tabindex={index === focusedIndex ? "0" : "-1"}
          aria-selected={index === focusedIndex}
        >
          {result.name}
        </button>
      {/each}
    </div>
  {/if}
	{#each $form.recipeIngredients as ingredient (ingredient.id)}
		<div class="flex-container">
			<div style="width: 150px">{ingredient.name}</div>
			<div class="flex-container">
				<div>
					<input 
						placeholder="100"
						bind:value={ingredient.recipeNumberOf}
						id="grid-first-name" 
						type="text"
					>
				</div>
				<div>
					<input
						placeholder="g"
						bind:value={ingredient.recipeMeasurementUnit}
						id="grid-last-name" 
						type="text"
					>
				</div>
				<button
					on:click|preventDefault={() => removeIngredient(ingredient)}
				>
					x
				</button>
			</div>
		</div>
  {/each}
	<input
    type="text"
    placeholder="Search for ingredients..."
    bind:value={searchTerm}
    on:input={filterIngredients}
  />
</div>
