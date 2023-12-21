<script lang="ts">
	import { styleStore } from '$lib/stores/styles';
	import type { Recipe, ShoppingList, ShoppingListRecipe } from '../../../types/data';
	import type { PageData } from './$types';
	import Modal from '../../components/Modal.svelte';
	import { enhance } from '$app/forms';
	export let data: PageData;

	interface SortedRecipes {
		shoppingListRecipes: ShoppingListRecipe[];
		absentRecipes: Recipe[];
	}

	$: shoppingLists = data.shoppingLists;
	const recipes = data.recipes;

	let showModal = false;
	let shoppingListToAddto: number | undefined = undefined;
	let sortedRecipes: SortedRecipes = { shoppingListRecipes: [], absentRecipes: [] };

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

<div class="flex flex-col gap-8">
	<div class="flex flex-col gap-4">
		<h1>Shopping Lists</h1>
		<a href="/shopping-lists/add">
            <button class={$styleStore.btnPrimary}>
                <iconify-icon icon="ic:baseline-plus" />
                Create Shopping List
            </button>
        </a>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
		{#each shoppingLists as shoppingList}
			<div class={`${$styleStore.card} justify-between`}>
				<div class="flex justify-between">
					<!-- Shopping List Title -->
					<a href="shopping-lists/{shoppingList.id}">
						<h3>{shoppingList.name}</h3>
					</a>
					<!-- Shopping List Badges -->
					<div class="flex gap-2">
						<span class={$styleStore.badge}>{`${shoppingList.servings} Serves`}</span>
						<span class={$styleStore.badge}>{`$${shoppingList.cost} Total`}</span>
					</div>
				</div>
				<!-- Recipes -->
				<div class="space-y-0 shadow-xl">
					<div class="pl-3 pr-9 py-2 flex flex-row justify-between">
						<div class="w-5/12 font-semibold">Recipes</div>
						<div class="w-3/12 font-semibold">Servings</div>
					</div>
					{#each shoppingList.recipes as recipe, i}
						<div class={i % 2 == 1 ? 'm-0' : 'bg-surface-600/50 m-0'}>
							<div class="pl-3 pr-9 py-2 flex flex-row justify-between">
								<div class="w-9/12">
									<a href={`/recipes/${recipe.id}`}>
										{recipe.name}
									</a>
								</div>
								<div class="w-3/12">{recipe.servings || '-'}</div>
							</div>
						</div>
					{/each}
				</div>
				<!-- Recipe Table Header -->
				<!-- Shopping List Button/s -->
				<div class="flex flex-col xl:flex-row gap-4">
					<a class={`${$styleStore.btnSurface} w-full`} href="shopping-lists/{shoppingList.id}">
						View Shopping List
					</a>
					<button
						class={`${$styleStore.btnTertiaryOutline} w-full`}
						on:click|preventDefault={() => {
							sortRecipesForModal(shoppingList.recipes);
							addRecipeModal(shoppingList.id, sortedRecipes);
						}}
					>
						<iconify-icon icon="ic:baseline-plus" />
						Add to Shopping List
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<Modal dialogClass="bg-surface-300 rounded-lg" bind:showModal>
	<h2 slot="header">Add Recipe to Shopping List</h2>
	<form
		id="add-recipe-to-shopping-list"
		method="POST"
		action="?/addToShoppingList"
		use:enhance={() => {
			return async ({ result, update }) => {
				showModal = false;
				update();
			};
		}}
	>
		<input type="hidden" name="shoppingListId" hidden value={shoppingListToAddto} />
		<!-- <input type="hidden" name="recipeId" hidden value={recipeId} />
		<input type="hidden" name="servings" hidden value={servings} /> -->
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
