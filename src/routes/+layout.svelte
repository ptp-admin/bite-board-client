<script lang="ts">
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import 'iconify-icon';
	import { page } from '$app/stores';
	import { AppShell, AppBar, Drawer, drawerStore, LightSwitch } from '@skeletonlabs/skeleton';
	import Navigation from '../components/Navigation.svelte';

	function drawerOpen(): void {
		drawerStore.open({});
	}

	$: classesSidebarLeft = $page.url.pathname === '/' ? 'w-0' : 'w-0 lg:w-64';
</script>

<!-- Drawer -->
<Drawer width="w-80">
	<h2 class="p-4">Navigation</h2>
	<hr />
	<Navigation />
</Drawer>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-900/10 w-0 lg:w-64 {classesSidebarLeft}">
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<div class="w-full">
			<AppBar background="bg-primary-500">
				<svelte:fragment slot="lead">
					<div class="flex items-center">
						<button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
							<span>
								<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
									<rect width="100" height="20" />
									<rect y="30" width="100" height="20" />
									<rect y="60" width="100" height="20" />
								</svg>
							</span>
						</button>
						<strong class="text-xl">Bite Board</strong>
					</div>
				</svelte:fragment>
				<svelte:fragment slot="trail">
					<LightSwitch />
					<!-- <a class="btn btn-sm" href="/">Home</a>
					<a class="btn btn-sm" href="/about">About</a> -->
				</svelte:fragment>
			</AppBar>
		</div>
	</svelte:fragment>
	<!-- Left Sidebar Slot -->
	<svelte:fragment slot="sidebarLeft">
		<div class="flex">
			<Navigation />
		</div>
	</svelte:fragment>
	<!-- Page Route Content -->
	<div class="container p-10 space-y-4 m-auto">
		<slot />
	</div>
</AppShell>