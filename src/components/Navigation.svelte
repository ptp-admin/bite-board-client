<script lang="ts">
	import { drawerStore } from '@skeletonlabs/skeleton';

	function drawerClose(): void {
		drawerStore.close();
}
</script>

<nav class="list-nav flex h-screen p-4 -mt-[60px] pt-[76px] w-full">
	<ul class="w-full">
		<li><a href="/" on:click={drawerClose}>Home</a></li>
		<li><a href="/recipes" on:click={drawerClose}>Recipes</a></li>
		<li><a href="/ingredients" on:click={drawerClose}>Ingredients</a></li>
	</ul>
</nav>