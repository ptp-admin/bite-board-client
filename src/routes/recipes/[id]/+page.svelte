<script lang="ts">
	import type { Recipe } from '../../../../types/data';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import DeleteRecipeButton from '../../../components/DeleteRecipeButton.svelte';
	import RecipeForm from '../../../components/RecipeForm.svelte';

	export let data: PageData;

	let recipe: Recipe = data.recipe;
	recipe.editable = false;

	const { form, errors, enhance } = superForm(data.form, {
		dataType: 'json',
		applyAction: false,
		invalidateAll: true,
		multipleSubmits: 'prevent',
		onResult({ result }){
			if (result.data.success) {
				recipe = result.data.recipe
			}
			recipe.editable = false
		}
	});
</script>

<div>
	<!-- Back -->
	<div>
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href="javascript:history.back()">
			<button>Back</button>
		</a>
	</div>
	{#if !recipe.editable}
		<!-- Recipe Card -->
		<main>
			<div>
				<!-- Recipe Heading -->
				<div id="heading">
					<div>
						<h1>
							{recipe.name}
						</h1>
						<div>
							<div>{recipe.servings} Serves</div>
							<div>${recipe.costPerServe}/Serve</div>
						</div>
					</div>
					<div />
				</div>
				<div>
					<!-- Ingredients -->
					<div>
						<h2>Ingredients</h2>
						{#if recipe.recipeIngredients && recipe.recipeIngredients.length > 0}
							<ul>
								{#each recipe.recipeIngredients as ingredient}
									<li>
										{ingredient.recipeNumberOf}
										{ingredient.recipeMeasurementUnit}
										{ingredient.name}
									</li>
									<div />
								{/each}
							</ul>
						{:else}
							<p>There are no ingredients in this recipe</p>
						{/if}
					</div>
					<!-- Method -->
					<div>
						<h2>Method</h2>
						<p>{@html recipe.method}</p>
					</div>
				</div>
			</div>
		</main>
		<!-- Add to Shopping List/Edit -->
		<div>
			<!-- <a href="/">
				Add to Shopping List
			</a> -->
			<br />
			<button on:click={() => (recipe.editable = !recipe.editable)}>Edit Recipe</button>
		</div>
		<DeleteRecipeButton {data} {recipe} />
	{:else}
		<RecipeForm {data} {form} {errors} {enhance} {recipe} action="/recipes?/update">
			<button>Update Recipe</button>
		</RecipeForm>
	{/if}
</div>
