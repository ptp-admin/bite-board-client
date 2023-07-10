<script lang="ts">
	import Editor from '@tinymce/tinymce-svelte';
	import AutoComplete from './AutoComplete.svelte';
	import type { Recipe } from '../../types/data';

	export let data: any
	export let form: any
	export let errors: any
	export let enhance: any
	export let action: string = '/recipes?/create'
	export let recipe: Recipe = {
			name: '',
			method: `
			<ol>
				<li>Add a recipe name and servings to your recipe</li>
				<li>Add existing ingredients by searching for them by name</li>
				<li>Add a new ingredient by typing the ingredient name and selecting 'add'</li>
				<li>Edit this text field to add your cooking steps</li>
			</ol>
		`,
			servings: undefined,
			recipeIngredients: []
		}

	const { apiKey } = data;

	form.set(recipe);
</script>

<form method="POST" action={action} class="bg-gray-200 p-6" use:enhance>
	<div class="flex-container">
		<!-- Left Side -->
		<div class="half-width">
			<div class="flex-container">
				<!-- Name -->
				<div class="half-width">
					<label for="name"><h3>Name</h3></label>
					<input type="text" id="name" name="name" bind:value={$form.name} />
					{#if $errors.name}
						<small style="color: red">{$errors.name}</small>
					{/if}
				</div>
				<!-- Servings -->
				<div class="half-width">
					<label for="servings"><h3>Servings</h3></label>
					<input type="text" id="servings" name="servings" bind:value={$form.servings} />
					{#if $errors.servings}
						<small style="color: red">{$errors.servings}</small>
					{/if}
				</div>
			</div>
			<!-- Ingredients -->
			<AutoComplete {data} {form} />

			<!-- Submit -->
			<slot />
		</div>
		<!-- Right Side -->
		<div class="half-width">
			<!-- Method -->
			<div>
				<label for="method"><h3>Method</h3></label>
				<Editor {apiKey} bind:value={$form.method} />
			</div>
		</div>
	</div>
</form>

<style>
	h3 {
		margin: 0.25em 0;
	}
	input {
		width: 90%;
	}

	.flex-container {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	.half-width {
		width: 50%;
	}
</style>
