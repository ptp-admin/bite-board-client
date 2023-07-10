<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import RecipeForm from '../../../components/RecipeForm.svelte';

	export let data: PageData;

	const { form, errors, enhance } = superForm(data.form, {
		dataType: 'json',
		resetForm: true,
		multipleSubmits: 'prevent'
	});
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="javascript:history.back()" class="btn btn-sm btn-outline mb-3">
	<button>Back</button>
</a>
<h1>Create New Recipe</h1>

<RecipeForm {data} {form} {errors} {enhance}>
	<button>Add Recipe</button>
</RecipeForm>
