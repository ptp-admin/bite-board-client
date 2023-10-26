<script lang="ts">
	import { styleStore } from '$lib/stores/styles';
	import type { ShoppingList, ShoppingListRecipe } from '../../../types/data';
	import type { PageData } from './$types';

	export let data: PageData;
	const shoppingLists: ShoppingList[] = data.shoppingLists;
	const dummyShoppingListRecipes: ShoppingListRecipe[] = [
		{
			id: 1,
			name: 'Chicken Schnitzel',
			servings: 4
		},
		{
			id: 2,
			name: 'Another Recipe',
			servings: 12
		}
	];
</script>

<div class="flex flex-col gap-8">
    <div class="flex flex-col gap-4">
        <h1>Shopping Lists</h1>
        <!-- <a href="/shopping-lists/add">
            <button class={$styleStore.btnPrimary}>
                <iconify-icon icon="ic:baseline-plus" />
                Create Shopping List
            </button>
        </a> -->
    </div>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {#each data.shoppingLists as shoppingList}
            <div class={`${$styleStore.card} justify-between`}>
                <div class="flex justify-between">
                    <!-- Shopping List Title -->
                    <a href="shopping-lists/{shoppingList.id}">
                        <h3>{shoppingList.name}</h3>
                    </a>
                    <!-- Shopping List Badges -->
                    <div class="flex gap-2">
                        <span class={$styleStore.badge}>16 Serves</span>
                        <!-- <span class="{$styleStore.badge} {costAccuracyBgColor(shoppingList.costAccuracy)}"
                            >${shoppingList.costPerServe}/Serve</span
                        > -->
                        <span class={$styleStore.badge}>$70.6/Serve</span>
                    </div>
                </div>
                <!-- Recipes -->
                <div class="space-y-0 shadow-xl">
                    <div class="pl-3 pr-9 py-2 flex flex-row justify-between">
                        <div class="w-5/12 font-semibold">Recipes</div>
                        <div class="w-3/12 font-semibold">Servings</div>
                    </div>
                    {#each dummyShoppingListRecipes as recipe, i}
                    <div class={i % 2 == 1 ? 'm-0' : 'bg-surface-600/50 m-0'}>
                        <div class="pl-3 pr-9 py-2 flex flex-row justify-between">
                            <div class="w-9/12">{recipe.name}</div>
                            <div class="w-3/12">{recipe.servings}</div>
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
                    <!-- <a class={`${$styleStore.btnTertiaryOutline} w-full`} href="">
                        <iconify-icon icon="ic:baseline-plus" />
                        Add to Shopping List
                    </a> -->
                </div>
            </div>
        {/each}
    </div>
</div>
