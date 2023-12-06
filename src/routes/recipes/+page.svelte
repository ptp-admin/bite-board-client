<script lang="ts">
	import type { PageData } from './$types';
	import { styleStore } from '$lib/stores/styles';
	import { costAccuracyBgColor } from '$lib/helper';
	import type { Recipe, ShoppingList } from '../../../types/data';
	import Modal from '../../components/Modal.svelte';
	import { enhance } from '$app/forms';
	export let data: PageData;

	interface SortedShoppingLists {
		alreadyInShoppingLists: ShoppingList[];
		notInShoppingLists: ShoppingList[];
	}

	const recipes: Recipe[] = data.recipes.map((recipe: Recipe) => {
		if (!recipe.servings) recipe.servings = 1;
		return recipe;
	});
	$: shoppingLists = data.shoppingLists;

	let showModal = false;
	let recipeToAdd: number | undefined = undefined;
	let servings: number | undefined = undefined;
	let sortedShoppingLists: SortedShoppingLists = { alreadyInShoppingLists: [], notInShoppingLists: [] }

	const addRecipeModal = (recipeId: number, recipeServings: number) => {
		recipeToAdd = recipeId;
		servings = recipeServings;
		showModal = true;
	};

	const sortShoppingListsForModal = (recipeId: number) => {
		sortedShoppingLists = { alreadyInShoppingLists: [], notInShoppingLists: [] };
		sortedShoppingLists = shoppingLists.reduce(
			(
				{ alreadyInShoppingLists, notInShoppingLists }: SortedShoppingLists,
				shoppingList: ShoppingList
			) => {
				if (shoppingList.recipes.some((recipe) => recipe.id === recipeId)) {
					return {
						alreadyInShoppingLists: [...alreadyInShoppingLists, shoppingList],
						notInShoppingLists
					};
				} else {
					return {
						alreadyInShoppingLists,
						notInShoppingLists: [...notInShoppingLists, shoppingList]
					};
				}
			},
			sortedShoppingLists
		);
	};
</script>

<div class="flex flex-col gap-4">
	<h1>Recipes</h1>
	<a href="/recipes/add">
		<button class={$styleStore.btnPrimary}>
			<iconify-icon icon="ic:baseline-plus" />
			Create Recipe
		</button>
	</a>
</div>

<div class="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
	{#each data.recipes as recipe, i}
		<div class={`${$styleStore.card} justify-between`}>
			<div class="flex justify-between">
				<!-- Recipe Title -->
				<a href="recipes/{recipe.id}">
					<h3>{recipe.name}</h3>
				</a>

				<!-- Recipe Badges -->
				<div class="flex gap-2">
					<span class={$styleStore.badge}>{recipe.servings} Serves</span>
					<span class="{$styleStore.badge} {costAccuracyBgColor(recipe.costAccuracy)}"
						>${recipe.costPerServe}/Serve</span
					>
				</div>
			</div>
			<!-- Recipe Button/s -->
			<div class="flex flex-col xl:flex-row gap-4">
				<a class={`${$styleStore.btnSurface} w-full`} href="recipes/{recipe.id}"> View Recipe </a>
				<button
					class={`${$styleStore.btnTertiaryOutline} w-full`}
					on:click|preventDefault={() => {
						sortShoppingListsForModal(recipe.id);
						addRecipeModal(recipe.id, recipe.servings);
					}}
				>
					<iconify-icon icon="ic:baseline-plus" />
					Add to Shopping List
				</button>
			</div>
		</div>
	{/each}
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
		<input type="hidden" name="recipeId" hidden value={recipeToAdd} />
		<input type="hidden" name="servings" hidden value={servings} />
		{#if sortedShoppingLists.alreadyInShoppingLists.length > 0}
			<h3>Already in Shopping List:</h3>
			<ul>
				{#each sortedShoppingLists.alreadyInShoppingLists as shoppingList}
					<li class="flex gap-3 items-center list-none -ml-2">
						<!-- <input type="radio" class="radio" name="shoppingListId" value={shoppingList.id} /> -->
						{shoppingList.name}
					</li>
				{/each}
			</ul>
		{/if}
		<h3>Add to Shopping List:</h3>
		<ul>
			{#each sortedShoppingLists.notInShoppingLists as shoppingList}
				<li class="flex gap-3 items-center list-none -ml-2">
					<input type="radio" class="radio" name="shoppingListId" value={shoppingList.id} />
					{shoppingList.name}
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
