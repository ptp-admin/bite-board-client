<script lang="ts">
	import Editor from '@tinymce/tinymce-svelte';
	import AutoComplete from './AutoComplete.svelte';
	import { styleStore } from '$lib/stores/styles';
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

<form method="POST" action={action} class={$styleStore.card} use:enhance>
	<div class="flex flex-col lg:flex-row gap-4">
		<!-- Left Side -->
		<div class="flex flex-col gap-2 lg:w-1/2 justify-between">
			<div>
				<div class="flex gap-2">
					<!-- Name -->
					<div class="w-1/2">
						<label class={$styleStore.label} for="name">Name</label>
						<input class={$styleStore.input} type="text" id="name" name="name" bind:value={$form.name} />
						{#if $errors.name}
							<small style="color: red">{$errors.name}</small>
						{/if}
					</div>
					<!-- Servings -->
					<div class="w-1/2">
						<label class={$styleStore.label} for="servings">Servings</label>
						<input class={$styleStore.input} type="text" id="servings" name="servings" bind:value={$form.servings} />
						{#if $errors.servings}
							<small style="color: red">{$errors.servings}</small>
						{/if}
					</div>
				</div>
				<!-- Ingredients -->
				<p class={$styleStore.label}>Ingredients</p>
				<AutoComplete {data} {form} />
			</div>
			<div class="hidden lg:flex lg:gap-2">
				<slot />
			</div>
		</div>

		<!-- Right Side -->
		<div class="lg:w-1/2">
			<!-- Method -->
			<div>
				<label class={$styleStore.label} for="method">Method</label>
				<Editor {apiKey} bind:value={$form.method} />
			</div>
		</div>
	</div>
	<!-- Submit -->
	<div class="flex gap-2 lg:hidden">
		<slot />
	</div>
</form>

