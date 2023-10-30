<script lang="ts">
	import { styleStore } from '$lib/stores/styles';
	import type { ShoppingList } from '../../../../types/data';
	import type { PageData } from './$types';
	import _ from 'lodash';

	export let data: PageData;
	const shoppingList: ShoppingList = data.shoppingList;

	const categorisedIngredients = _.chain(shoppingList.ingredients)
		.groupBy('category')
		.map((value, key) => {
			return {
				category: key ? key : 'Uncategorised',
				ingredients: value,
				checked: false
			};
		})
		.orderBy('category')
		.sortBy((i) => i.category === 'Uncategorised')
		.value();
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
		<!-- Shopping List Name -->
		<div>
			<h1 class="my-2">{shoppingList.name}</h1>
		</div>
		<div class="flex flex-col gap-2">
			{#each categorisedIngredients as { category, ingredients }}
				<b>{category}</b>
				<ul class="flex flex-col gap-2">
					{#each ingredients as ingredient}
						<li class="flex gap-3 items-center list-none -ml-2">
							<input class="checkbox" type="checkbox" bind:checked={ingredient.checked} />
							<div class={`flex gap-3 ${ingredient.checked ? 'line-through' : ''}`}>
								<div class="font-semibold">{ingredient.numberOf} {ingredient.unit}</div> {ingredient.name}
							</div>
						</li>
					{/each}
				</ul>
			{/each}
		</div>
	</div>
</div>
