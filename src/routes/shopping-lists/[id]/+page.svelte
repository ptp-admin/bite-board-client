<script lang="ts">
	import { styleStore } from '$lib/stores/styles';
	import type { Recipe, ShoppingList, ShoppingListRecipe } from '../../../../types/data';
	import Modal from '../../../components/Modal.svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import _ from 'lodash';
	import { invalidateAll } from '$app/navigation';
	export let data: PageData;

	interface SortedRecipes {
		shoppingListRecipes: ShoppingListRecipe[];
		absentRecipes: Recipe[];
	}

	let dropdown = false;
	let showModal = false;
	let sortedRecipes: SortedRecipes = { shoppingListRecipes: [], absentRecipes: [] };

	const recipes = data.recipes;

	$: shoppingList = data.shoppingList;
	$: shoppingListToAddto = shoppingList.id;
	$: sortedIngredients = _.chain(shoppingList.ingredients)
		.map(({ category, ...rest }) => {
			return {
				category: category ? category : 'Uncategorised',
				...rest
			};
		})
		.sortBy('category')
		.sortBy((i) => i.category === 'Uncategorised')
		.value();
	$: formattedList = sortedIngredients.reduce((acc, ingredient) => {
		const ingredientString = `[${ingredient.numberOf} ${ingredient.unit}] ${ingredient.name} \n `;
		return (acc = acc + ingredientString);
	}, '');

	const copyContent = async () => {
		try {
			await navigator.clipboard.writeText(formattedList);
			console.log('Content copied to clipboard');
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	};

	const addRecipeModal = (shoppingListId: number, sortedRecipes: SortedRecipes) => {
		shoppingListToAddto = shoppingListId;
		showModal = true;
	};

	const sortRecipesForModal = (shoppingListRecipes: ShoppingListRecipe[]) => {
		const absentRecipes = recipes.filter((recipe: Recipe) => {
			return !shoppingListRecipes.some((shoppingListRecipe) => {
				return shoppingListRecipe.id === recipe.id;
			});
		});
		sortedRecipes = { shoppingListRecipes, absentRecipes };
	};
</script>

<div class="flex flex-col gap-4">
	<!-- Breadcrumbs -->
	<ol class="breadcrumb m-0">
		<li class="crumb"><a class="anchor" href="/shopping-lists">Shopping Lists</a></li>
		<li class="crumb-separator" aria-hidden>&rsaquo;</li>
		<li>{shoppingList.name}</li>
	</ol>

	<!-- Shopping List Card -->
	<div class="{$styleStore.card} p-8">
		<div class="flex justify-between">
			<!-- Shopping List Title -->
			<h1>{shoppingList.name}</h1>

			<!-- Shopping List Badges -->
			<div class="flex gap-2">
				<span class={$styleStore.badgeLarge}>{`${shoppingList.servings} Serves`}</span>
				<span class={$styleStore.badgeLarge}>{`$${shoppingList.cost} Total`}</span>
			</div>
		</div>

		<div class="flex gap-2">
			<!-- Copy Button -->
			<button
				on:click|preventDefault={() => {
					sortRecipesForModal(shoppingList.recipes);
					addRecipeModal(shoppingList.id, sortedRecipes);
				}}
				class={$styleStore.btnPrimary}>+ Add Recipe to List</button
			>
			<button on:click={copyContent} class={$styleStore.btnTertiaryOutline}
				>Copy List to Clipboard</button
			>
		</div>

		<!-- Ingredients -->
		<div>
			<div class="pl-3 pr-9 py-2 flex flex-row justify-between">
				<h2 class="w-5/12 font-semibold">Ingredient</h2>
				<h2 class="w-3/12 font-semibold">Category</h2>
			</div>
			<div class="flex flex-col gap-2">
				{#each sortedIngredients as ingredient, i}
					<div class={i % 2 == 1 ? 'm-0' : 'bg-surface-600/50 m-0'}>
						<div class="pl-3 pr-9 py-2 flex flex-row justify-between">
							<div class="w-9/12 flex gap-3 items-center list-none">
								<input class="checkbox" type="checkbox" bind:checked={ingredient.checked} />
								<div class={`flex gap-3 ${ingredient.checked ? 'line-through' : ''}`}>
									<span class="font-semibold">{ingredient.numberOf} {ingredient.unit}</span>
									{ingredient.name}
								</div>
							</div>
							<div class={`w-3/12 ${ingredient.checked ? 'line-through' : ''}`}>
								{ingredient.category || 'Uncategorised'}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Recipes -->
		{#if dropdown}
			<button class={$styleStore.btnSurface} on:click={() => (dropdown = !dropdown)}
				>Hide Recipes ▲</button
			>
			<div class="flex flex-col">
				<div class="pl-3 pr-9 py-2 flex flex-row justify-between">
					<h2 class="w-8/12 font-semibold">Recipes</h2>
					<h2 class="w-4/12 font-semibold">Servings</h2>
				</div>
				{#each shoppingList.recipes as recipe, i}
					<div class={i % 2 == 1 ? 'm-0' : 'bg-surface-600/50 m-0'}>
						<div class="pl-3 pr-9 py-2 flex flex-row justify-between">
							<!-- Recipe Name -->
							<div class="w-8/12">
								<a href={`/recipes/${recipe.id}`}>
									{recipe.name}
								</a>
							</div>
							<!-- Recipe Servings -->
							<div class="w-3/12">
								<form
									id={`update-recipe-${recipe.id}-servings`}
									method="POST"
									action="?/updateRecipeServings"
									use:enhance={() => {
										return async ({ result, update }) => {
											console.log('result', result);
											
											invalidateAll();
										};
									}}
								>
									<input type="hidden" name="shoppingListId" hidden value={shoppingList.id} />
									<input type="hidden" name="recipeId" hidden value={recipe.id} />
									<input type="number" name="servings" value={recipe.servings} class="w-20" />
								</form>
							</div>
							<!-- Buttons -->
							<div class="w-1/12 flex items-end">
								<form
									id="delete-recipe-from-shopping-list"
									method="POST"
									action="?/deleteRecipe"
									use:enhance
								>
									<input type="hidden" name="shoppingListId" hidden value={shoppingList.id} />
									<input type="hidden" name="recipeId" hidden value={recipe.id} />
									<!-- Delete Recipe Button -->
									<button
										type="submit"
										form="delete-recipe-from-shopping-list"
										class={`${$styleStore.btnError} w-8`}
									>
										<iconify-icon icon="ic:baseline-delete" />
									</button>
								</form>
								<!-- Save Changes Button -->
								<button
									type="submit"
									form={`update-recipe-${recipe.id}-servings`}
									class={`${$styleStore.btnPrimary} w-8`}
								>
									<iconify-icon icon="ic:baseline-check" />
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<button class={$styleStore.btnSurface} on:click={() => (dropdown = !dropdown)}
				>Shopping List includes {shoppingList.recipes.length}
				{shoppingList.recipes.length > 1 ? 'recipes' : 'recipe'} ▼</button
			>
		{/if}
	</div>
</div>

<Modal dialogClass="bg-surface-300 rounded-lg" bind:showModal>
	<h2 slot="header">Add Recipe to Shopping List</h2>
	<form
		id="add-recipe-to-shopping-list"
		method="POST"
		action="/shopping-lists?/addToShoppingList"
		use:enhance={() => {
			return async ({ result, update }) => {
				showModal = false;
				invalidateAll();
			};
		}}
	>
		<input type="hidden" name="shoppingListId" hidden value={shoppingListToAddto} />
		{#if sortedRecipes.shoppingListRecipes.length > 0}
			<h3>
				{sortedRecipes.shoppingListRecipes.length}
				Recipe{sortedRecipes.shoppingListRecipes.length > 1 ? 's' : ''} Already in Shopping List:
			</h3>
			<ul>
				{#each sortedRecipes.shoppingListRecipes as shoppingListRecipe}
					<li class="flex gap-3 items-center list-none -ml-2">
						{shoppingListRecipe.name}
					</li>
				{/each}
			</ul>
		{/if}
		<h3>Add Recipe:</h3>
		<ul>
			{#each sortedRecipes.absentRecipes as absentRecipe}
				<li class="flex gap-3 items-center list-none -ml-2">
					<input
						type="radio"
						class="radio"
						name="recipe"
						value={JSON.stringify({ recipeId: absentRecipe.id, servings: absentRecipe.servings })}
					/>
					{absentRecipe.name}
				</li>
			{/each}
		</ul>
	</form>
	<button
		type="submit"
		form="add-recipe-to-shopping-list"
		slot="button"
		class={$styleStore.btnPrimary}>Add</button
	>
</Modal>
