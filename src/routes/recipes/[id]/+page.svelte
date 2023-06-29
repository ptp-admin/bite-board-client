<script>
	/** @type {import('./$types').PageData} */
	export let data;
	const { name, method, servings, recipeIngredients, costPerServe } = data.recipe
</script>

<div>
	<!-- Back -->
	<div>
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href="javascript:history.back()">
			Back
		</a>
	</div>
	<!-- Recipe Card -->
	<main>
		<div>
			<!-- Recipe Heading -->
			<div id="heading">
				<div>
					<h1>
						{name}
					</h1>
					<div >
						<div>{servings} Serves</div>
						<div>${costPerServe}/Serve</div>
					</div>
				</div>
				<div />
			</div>
			<div>
				<!-- Ingredients -->
				<div>
					<h2>
						Ingredients
					</h2>
					<ul>
						{#each recipeIngredients as ingredient}
							<li>{ingredient.recipe_number_of} {ingredient.recipe_measurement_unit} {ingredient.ingredient_name}</li>
							<div />
						{/each}
					</ul>	
				</div>
				<!-- Method -->
				<div>
					<h2>
						Method
					</h2>
					<p>{@html method}</p>
				</div>
			</div>
		</div>
		
	</main>
	<!-- Add to Shopping List/Edit -->
	<!-- <div>
		<a href="/">
			Add to Shopping List
		</a>
		<br/>
		<a href="/">
			Edit Recipe
		</a>
	</div> -->
</div>