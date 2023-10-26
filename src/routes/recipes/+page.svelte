<script lang="ts">
	import type { PageData } from './$types';
	import { styleStore } from '$lib/stores/styles';
	import { costAccuracyBgColor } from '$lib/helper';
	import type { Recipe } from '../../../types/data';
	export let data: PageData;

	const recipes: Recipe[] = data.recipes.map((recipe: Recipe) => {
		if (!recipe.servings) recipe.servings = 1;
		return recipe;
	});
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
	{#each data.recipes as recipe}
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
				<a class={`${$styleStore.btnTertiaryOutline} w-full`} href="">
					<iconify-icon icon="ic:baseline-plus" />
					Add to Shopping List
				</a>
			</div>
		</div>
	{/each}
</div>
