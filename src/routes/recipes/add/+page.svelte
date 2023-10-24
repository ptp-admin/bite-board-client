<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import RecipeForm from '../../../components/RecipeForm.svelte';
	import { styleStore } from '$lib/stores/styles';

	export let data: PageData;

	const { form, errors, enhance } = superForm(data.form, {
		dataType: 'json',
		resetForm: true,
		multipleSubmits: 'prevent'
	});
</script>

<ol class="breadcrumb m-0">
	<li class="crumb"><a class="anchor" href="/recipes">Recipes</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li>Add Recipe</li>
</ol>
<h2>Create New Recipe</h2>
<RecipeForm {data} {form} {errors} {enhance}>
	<button class={$styleStore.btnPrimary}>Add Recipe</button>
</RecipeForm>
