<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { NewIngredientSchema } from '../schemas';

	import { beforeUpdate } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';

	export let data: SuperValidated<NewIngredientSchema>;
	export let action: string;
	export let formId: string;
	export let measurementUnitOptions: string[];
	export let ingredient: any = null; // TODO update this type

	// Conditional styling for the 'Add New Ingredient' card only
	let inputClass = 'input bg-surface-50 focus:outline-none focus:ring-0 h-8 py-1 px-2.5 rounded-lg'
	let selectClass = 'select h-8 py-1 px-1.5 bg-surface-50 focus:outline-none focus:ring-0 rounded-lg'
	if (action === '?/create') {
		inputClass = inputClass.concat(' shadow-md')
		selectClass = selectClass.concat(' shadow-md')
	} else {
		inputClass = inputClass.concat(' border-surface-700')
		selectClass = selectClass.concat(' border-surface-700')
	}

	const { form, errors, enhance } = superForm(data, {
		id: formId,
		applyAction: true,
		resetForm: true,
		multipleSubmits: 'prevent',
		taintedMessage: null
	});

	if (!ingredient) {
		form.set({
			name: '',
			category: '',
			costPer: 0,
			numberOf: 0,
			measurementUnit: ''
		});
	}

	beforeUpdate(() => {
		if (ingredient) {
			form.set(ingredient);
		}
	});
</script>

<form method="POST" {action} use:enhance>
	<div class="flex items-center gap-1">
		<input type="hidden" name="id" bind:value={$form.id} />
		<!-- Name -->
		<div class="w-1/3">
			{#if !$form.id}
				<label class="h-6 font-medium" for="name">Name</label>
			{/if}
			<input
				class={inputClass}
				placeholder={$form.id ? 'Name' : ''}
				type="text"
				id="name"
				name="name"
				bind:value={$form.name}
			/>
		</div>
		<!-- Category -->
		<div class="w-1/3">
			{#if !$form.id}
				<label class="h-6 font-medium" for="category">Category</label>
			{/if}
			<input
				class={inputClass}
				placeholder={$form.id ? 'Category' : ''}
				type="text"
				id="category"
				name="category"
				bind:value={$form.category}
			/>
			{#if $errors.category}
				<small style="color: red">{$errors.category}</small>
			{/if}
		</div>
		<!-- Cost -->
		{#if $form.id}
			$
		{/if}
		<div class="w-1/12">
			{#if !$form.id}
				<label class="h-6 font-medium" for="costPer">Cost</label>
			{/if}
			<input
				placeholder={$form.id ? 'Cost' : ''}
				class={inputClass}
				type="text"
				id="costPer"
				name="costPer"
				bind:value={$form.costPer}
			/>
			{#if $errors.costPer}
				<small style="color: red">{$errors.costPer}</small>
			{/if}
		</div>
		<!-- Number -->
		{#if $form.id}
			/
		{/if}
		<div class="w-1/12">
			{#if !$form.id}
				<label class="h-6 font-medium" for="numberOf">Number</label>
			{/if}
			<input
				placeholder={$form.id ? 'Num' : ''}
				class={inputClass}
				type="text"
				id="numberOf"
				name="numberOf"
				bind:value={$form.numberOf}
			/>
			{#if $errors.numberOf}
				<small style="color: red">{$errors.numberOf}</small>
			{/if}
		</div>
		<!-- Unit -->
		<div class="w-1/12">
			{#if !$form.id}
				<label class="h-6 font-medium" for="measurementUnit">Unit</label>
			{/if}
			<select
				class={selectClass}
				bind:value={$form.measurementUnit}
				name="measurementUnit"
			>
				{#each measurementUnitOptions as measurementUnit}
					<option value={measurementUnit}>{measurementUnit}</option>
				{/each}
			</select>
			{#if $errors.measurementUnit}
				<small style="color: red">{$errors.measurementUnit}</small>
			{/if}
		</div>
		{#if $form.id}
			<!-- Accept Edit Ingredient -->
			<button
				class="btn btn-sm w-8 h-8 bg-primary-500 rounded-lg"
				on:click={() => (ingredient.editable = false)}>
					<iconify-icon icon="ic:baseline-check" />
				</button
			>
		{:else}
		<!-- Add New Ingredient -->
			<button class="btn btn-sm w-1/12 h-8 bg-primary-500 mt-6 rounded-lg shadow-md">Add</button>
		{/if}
		<slot />
	</div>
	{#if $errors.name}
		<small class="text-error-500 ml-1">{$errors.name}</small>
	{/if}
	{#if action === '?/create'}
	<div class="mt-4">
		<p class="font-medium">Preview</p>
		<div class="rounded-lg bg-surface-100/30 py-2 px-3 flex flex-row justify-between shadow-md">
			<div class="w-1/3">{$form.name ? $form.name : 'Ingredient Name'}</div>
			<div class="w-1/3">{$form.category ? $form.category : 'Category'}</div>
			<div class="w-1/3">${$form.costPer}/{$form.numberOf}{$form.measurementUnit ? $form.measurementUnit : 'g'}</div>
		</div>
	</div>
	{/if}
</form>
