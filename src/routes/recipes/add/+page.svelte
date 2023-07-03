<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import Editor from '@tinymce/tinymce-svelte';
	import AutoComplete from '../../../components/AutoComplete.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, errors, enhance } = superForm(data.form, {
		dataType: 'json',
		resetForm: true,
		multipleSubmits: 'prevent'
	});

	const { apiKey } = data	
	let methodPlaceholder = `
		<ol>
			<li>Add a recipe name and servings to your recipe</li>
			<li>Add the ingredients by searching for them by name</li>
			<li>Edit this text field to add your cooking steps</li>
		</ol>
	`;

	form.set({
		name: '',
		method: methodPlaceholder,
		servings: undefined,
		recipeIngredients: []
	});
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="javascript:history.back()" class="btn btn-sm btn-outline mb-3">
	<button>Back</button>
</a>
<h1>Create New Recipe</h1>

<form method="POST" class="bg-gray-200 p-6" use:enhance>
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
			<button>Add Recipe</button>
		</div>
		<!-- Right Side -->
		<div class="half-width">
			<!-- Method -->
			<div>
				<label for="method"><h3>Method</h3></label>
				<!-- <input name="method" type="hidden" value={method} /> -->
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
