<script lang="ts">
	import type { Recipe } from '../../../../types/data';
	import type { PageData } from './$types';

	export let data: PageData;
	const recipe: Recipe = data.recipe;
	const { name, method, servings, recipeIngredients, costPerServe } = recipe;
</script>

<div>
	<!-- Back -->
	<div>
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href="javascript:history.back()">
			<button>Back</button>
		</a>
	</div>
	<!-- Recipe Card -->
	<main>
		<div>
			<!-- Recipe Heading -->
			<div id="heading">
				<div>
					<h1>
						{name}
					</h1>
					<div>
						<div>{servings} Serves</div>
						<div>${costPerServe}/Serve</div>
					</div>
				</div>
				<div />
			</div>
			<div>
				<!-- Ingredients -->
				<div>
					<h2>Ingredients</h2>
					{#if recipeIngredients && recipeIngredients.length > 0}
						<ul>
							{#each recipeIngredients as ingredient}
								<li>
									{ingredient.recipeNumberOf}
									{ingredient.recipeMeasurementUnit}
									{ingredient.name}
								</li>
								<div />
							{/each}
						</ul>
					{:else}
						<p>There are no ingredients in this recipeyet. Add some!</p>
					{/if}
				</div>
				<!-- Method -->
				<div>
					<h2>Method</h2>
					<p>{@html method}</p>
				</div>
			</div>
		</div>
	</main>
	<!-- Add to Shopping List/Edit -->
	<!-- <div>
		<a href="/">
			Add to Shopping List
		</a>
		<br/>
		<a href="/">
			Edit Recipe
		</a>
	</div> -->
</div>
