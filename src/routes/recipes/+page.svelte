<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;

		console.log(data.recipes);
		
</script>

<h2>Recipes Database</h2>

{#each data.recipes as recipe}
	<p>
		<a href="recipes/{recipe.id}">
			{recipe.name}
		</a>
		| {recipe.servings} Serves @ ${recipe.costPerServe}/Serve
	</p>
{/each}