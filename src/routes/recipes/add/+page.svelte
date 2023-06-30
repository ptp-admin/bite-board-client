<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { NewRecipeSchema } from '../../../schemas';
	import { superForm } from 'sveltekit-superforms/client';

	export let data: SuperValidated<NewRecipeSchema>

	const { form, errors, enhance } = superForm(data, {
		resetForm: true,
		multipleSubmits: 'prevent'
	})
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="javascript:history.back()" class="btn btn-sm btn-outline mb-3">
	<button>Back</button>
</a>
<h1>Create New Recipe</h1>

<form 
	method="POST"
	class="bg-gray-200 p-6"
	use:enhance
>
	<!-- Name -->
	<div>
		<label for="name">Name</label>
		<input type="text" id="name" name="name" bind:value={$form.name} />
		{#if $errors.name}
			<small style="color: red">{$errors.name}</small>
		{/if}
	</div>

	<!-- Method -->
	<div>
		<label for="method">method</label>
		<input type="text" id="method" name="method" bind:value={$form.method} />
		{#if $errors.method}
			<small style="color: red">{$errors.method}</small>
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

	<button>Add Recipe</button>
</form>
