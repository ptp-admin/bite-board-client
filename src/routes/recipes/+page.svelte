<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<h2>Recipes Database</h2>

<a href="/recipes/add">
	<button>Add Recipe</button>
</a>

{#each data.recipes as recipe}
	<p>
		<a href="recipes/{recipe.id}">
			{recipe.name}
		</a>
		| {recipe.servings} Serves @ ${recipe.costPerServe}/Serve
	</p>
{/each}