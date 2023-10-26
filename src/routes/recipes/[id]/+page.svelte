<script lang="ts">
	import type { Recipe, RecipeIngredient } from '../../../../types/data';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { styleStore } from '$lib/stores/styles';
	import { onMount } from 'svelte';
	import { costAccuracyBgColor } from '$lib/helper';
	import DeleteRecipeButton from '../../../components/DeleteRecipeButton.svelte';
	import RecipeForm from '../../../components/RecipeForm.svelte';
	import IngredientForm from '../../../components/IngredientForm.svelte';
	import axios from 'axios';
	import _ from 'lodash';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	export let data: PageData;
	console.log(data);
	
	let recipe: Recipe = data.recipe;

	// Set defaults for recipe
	recipe.editable = false;
	if (!recipe.servings) recipe.servings = 1;

	const { form, errors, enhance } = superForm(data.form, {
		dataType: 'json',
		applyAction: false,
		invalidateAll: true,
		multipleSubmits: 'prevent',
		onResult({ result }) {
			// @ts-ignore
			if (result.data.success) {
				// @ts-ignore
				recipe = result.data.recipe;
			}
			recipe.editable = false;
		}
	});

	let costingIngredients = false;

	const editableIngredients: RecipeIngredient[] = recipe.recipeIngredients
		? _.chain(recipe.recipeIngredients)
				.map((i) => {
					return { ...i, editable: i.derivedCost ? false : true };
				})
				.sortBy('editable')
				.reverse()
				.value()
		: [];

	// Fetch the measurementUnitOptions list from the backend
	let measurementUnitOptions = [''];
	onMount(async () => {
		try {
			const response = await axios.get(`http://localhost:3456/ingredients/measurementUnits`);
			measurementUnitOptions = response.data;
		} catch (error) {
			console.error('Error fetching measurementUnitOptions:', error);
		}
	});
</script>

<div class="flex flex-col gap-4">
	{#if !recipe.editable}
		<!-- Breadcrumbs -->
		<ol class="breadcrumb m-0">
			<li class="crumb"><a class="anchor" href="/recipes">Recipes</a></li>
			<li class="crumb-separator" aria-hidden>&rsaquo;</li>
			<li>{recipe.name}</li>
		</ol>

		<!-- Recipe Card -->
		<div class="{$styleStore.card} p-8">
			<!-- Recipe Name -->
			<div>
				<h1>{recipe.name}</h1>
			</div>
			<!-- Servings -->
			<div class="flex flex-col gap-4">
				<div class="flex gap-4">
					<div>{recipe.servings || '1'} {recipe.servings != 1 ? 'Serves' : 'Serve'}</div>
					{#if recipe.costPerServe}
						| <div>${recipe.costPerServe}/Serve</div>
					{/if}
				</div>

				<div class="flex gap-2">
					<!-- Edit Button -->
					<button
						class="{$styleStore.btnTertiaryOutline} self-start"
						on:click={() => (recipe.editable = !recipe.editable)}>Edit Recipe</button
					>
					{#if recipe.recipeIngredients && recipe.recipeIngredients.length > 0}
						<!-- Cost Accuracy Button -->
						<button
							class="btn btn-sm py-1 rounded-lg self-start {costAccuracyBgColor(
								recipe.costAccuracy
							)}"
							on:click={() => (costingIngredients = !costingIngredients)}
							>{Math.ceil(recipe.costAccuracy * 100)}% Cost Accuracy
							<span class="badge variant-filled ml-2 w-6 h-6">?</span></button
						>
					{/if}
				</div>
			</div>
			{#if costingIngredients}
				<div class="card p-4 flex flex-col gap-2">
					<b
						>{editableIngredients.filter((i) => !i.derivedCost).length}/{recipe.recipeIngredients
							?.length} ingredients do not have a purchase cost.</b
					>
					<p>How much do these ingredients cost you to purchase?</p>
					{#each editableIngredients as ingredient}
						{#if !ingredient.editable}
							<div class="pl-3 flex flex-row justify-between items-center">
								<div class="w-5/12 lg:w-1/3">{ingredient.name}</div>
								<div class="w-4/12 lg:w-1/3">
									{#if ingredient.category}
										{ingredient.category}
									{:else}
										-
									{/if}
								</div>
								<div class="w-3/12 lg:w-1/3">
									${ingredient.costPer}/{ingredient.numberOf}{ingredient.measurementUnit}
								</div>
								<!-- Edit Ingredient Button -->
								<button
									class={`${$styleStore.btnSurface} w-8 justify-self-end`}
									on:click={() => {
										ingredient.editable = !ingredient.editable;
									}}
								>
									<iconify-icon icon="ic:baseline-edit" />
								</button>
							</div>
						{:else}
							<div>
								{#if ingredient.id}
									<IngredientForm
										formId={ingredient.id.toString()}
										data={data.form}
										action={'/ingredients?/update'}
										{ingredient}
										{measurementUnitOptions}
									>
										<div>
											<!-- Close/Exit Edit -->
											<button
												class={`${$styleStore.btnSurface} w-8`}
												on:click={() => (ingredient.editable = !ingredient.editable)}
											>
												<iconify-icon icon="ic:baseline-close" />
											</button>
										</div>
									</IngredientForm>
								{/if}
							</div>
						{/if}
					{/each}
					<button
						class="{$styleStore.btnTertiaryOutline} w-16"
						on:click={() => (costingIngredients = false)}>Hide</button
					>
				</div>
			{/if}
			<hr class="!border-t-2 my-4 bg-tertiary-100 h-1 w-1/4" />
			<!-- Bottom -->
			<div class="flex flex-col lg:flex-row gap-4">
				<!-- Left Side -->
				<div class="flex flex-col gap-2 lg:w-1/4 min-h-full">
					<!-- Ingredients -->
					<!-- <h3 class={$styleStore.label}>Ingredients</h3> -->
					{#if recipe.recipeIngredients && recipe.recipeIngredients.length > 0}
						{#each recipe.recipeIngredients as ingredient}
							<div class="flex">
								<div class="flex gap-1">
									<div>
										<b>{ingredient.recipeNumberOf} {ingredient.recipeMeasurementUnit}</b>
										{ingredient.name}
									</div>
								</div>
							</div>
						{/each}
					{:else}
						<p>There are no ingredients in this recipe</p>
					{/if}
					<div class="hidden lg:block">
						<slot />
					</div>
				</div>
				<!-- Right Side -->
				<div class="lg:w-3/4">
					<!-- Method -->
					<div>
						<!-- <h3 class={$styleStore.label}>Method</h3> -->
						{@html recipe.method}
					</div>
				</div>
			</div>
			<!-- Submit -->
			<div class="lg:hidden">
				<slot />
			</div>
		</div>
	{:else}
		<!-- Breadcrumbs -->
		<ol class="breadcrumb m-0">
			<li class="crumb"><a class="anchor" href="/recipes">Recipes</a></li>
			<li class="crumb-separator" aria-hidden>&rsaquo;</li>
			<li class="crumb">
				<a
					class="anchor"
					on:click={() => (recipe.editable = false)}
					on:keydown={() => (recipe.editable = false)}
					href="/recipes/{recipe.id}">{recipe.name}</a
				>
			</li>
			<li class="crumb-separator" aria-hidden>&rsaquo;</li>
			<li>Edit Recipe</li>
		</ol>
		<!-- <h2>Editing Recipe:</h2> -->
		<RecipeForm {data} {form} {errors} {enhance} {recipe} action="/recipes?/update">
			<button class={$styleStore.btnPrimary}>Save Changes</button>
			<DeleteRecipeButton {data} {recipe} />
			<button class={$styleStore.btnSurface} on:click={() => (recipe.editable = !recipe.editable)}
				>Cancel</button
			>
		</RecipeForm>
	{/if}
</div>
