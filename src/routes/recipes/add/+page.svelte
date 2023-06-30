<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { NewRecipeSchema } from '../../../schemas';
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

	$form.method = `
		<ol>
			<li>Add a recipe name and servings to your recipe</li>
			<li>Add the ingredients by searching for them by name</li>
			<li>Edit this text field to add your cooking steps</li>
		</ol>
	`;
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="javascript:history.back()" class="btn btn-sm btn-outline mb-3">
	<button>Back</button>
</a>
<h1>Create New Recipe</h1>

<form method="POST" class="bg-gray-200 p-6" use:enhance>
	<div class="flex-container">
		<!-- Name -->
		<div>
			<label for="name">Name</label>
			<input type="text" id="name" name="name" bind:value={$form.name} />
			{#if $errors.name}
				<small style="color: red">{$errors.name}</small>
			{/if}
		</div>
		<!-- Servings -->
		<div>
			<label for="servings">Servings</label>
			<input type="text" id="servings" name="servings" bind:value={$form.servings} />
			{#if $errors.servings}
				<small style="color: red">{$errors.servings}</small>
			{/if}
		</div>
	</div>

	<!-- Method -->
	<div>
		<label for="method">Method</label>
		<!-- <input name="method" type="hidden" value={method} /> -->
		<Editor bind:value={$form.method} />
	</div>

	<AutoComplete {data} {form} />

	<button>Add Recipe</button>
</form>

<style>
	.flex-container {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
</style>
