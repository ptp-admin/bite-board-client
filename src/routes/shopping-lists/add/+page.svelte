<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import RecipeForm from '../../../components/RecipeForm.svelte';
	import { styleStore } from '$lib/stores/styles';
	import { enhance } from '$app/forms';

	export let data: PageData;
</script>

<!-- Breadcrumbs -->
<ol class="breadcrumb m-0">
	<li class="crumb"><a class="anchor" href="/shopping-lists">Shopping Lists</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li>Add Shopping List</li>
</ol>

<div class="{$styleStore.card} p-8">
    <div class="flex gap-8 items-center justify-between">
        <!-- Shopping List Title -->
        <form method="POST" action="?/addShoppingList" use:enhance class="w-full flex gap-2 items-center">
                <input type="text" name="name" id="name" class="text-2xl h-11" placeholder="Shopping List Name" />
                <button class={`${$styleStore.btnPrimary} h-11`}>Save</button>
        </form>

        <!-- Shopping List Badges -->
        <div class="flex gap-2">
            <span class={$styleStore.badgeLarge}>0 Serves</span>
            <span class={$styleStore.badgeLarge}>$0 Total</span>
        </div>
    </div>

    <div class="flex gap-2">
        <!-- Copy Button -->
        <button
            disabled
            class={$styleStore.btnPrimary}>+ Add Recipe to List</button
        >
        <button disabled class={$styleStore.btnTertiaryOutline}
            >Copy List to Clipboard</button
        >
    </div>
</div>

