<script lang="ts">
	import { drawerStore } from '@skeletonlabs/skeleton';

	function drawerClose(): void {
		drawerStore.close();
}
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href="/" on:click={drawerClose}>Home</a></li>
		<li><a href="/recipes" on:click={drawerClose}>Recipes</a></li>
		<li><a href="/ingredients" on:click={drawerClose}>Ingredients</a></li>
	</ul>
</nav>