<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { NewIngredientSchema } from '../schemas';
	import { beforeUpdate } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { styleStore } from '$lib/stores/styles';

	export let data: SuperValidated<NewIngredientSchema>;
	export let action: string;
	export let formId: string;
	export let measurementUnitOptions: string[];
	export let ingredient: any = null; // TODO update this type

	// Conditional styling for the 'Add New Ingredient' card only
	let inputClass = $styleStore.input
	let selectClass = $styleStore.select
	if (action === '?/create') {
		inputClass = inputClass.concat(' border-surface-700')
		selectClass = selectClass.concat(' border-surface-700')
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
	<div class="flex flex-col xl:flex-row xl:items-center gap-1">
		<input type="hidden" name="id" bind:value={$form.id} />
		<div class="flex items-center gap-1 xl:w-2/3">
			<!-- Name -->
			<div class="w-1/2">
				<input
					placeholder="Name"
					type="text"
					id="name"
					name="name"
					bind:value={$form.name}
				/>
			</div>
			<!-- Category -->
			<div class="w-1/2">
				<input
					placeholder="Category"
					type="text"
					id="category"
					name="category"
					bind:value={$form.category}
				/>
				{#if $errors.category}
					<small style="color: red">{$errors.category}</small>
				{/if}
			</div>
		</div>
		{#if $errors.name}
			<small class="text-error-500 ml-1">{$errors.name}</small>
		{/if}
		<div class="flex items-center gap-1 xl:w-1/3">
			<!-- Cost -->
			$
			<div class="w-1/3 xl:w-1/4">
				<input
					placeholder="Cost"
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
			/
			<div class="flex w-2/3 xl:w-1/2">
				<div class="w-1/2">
					<input
						placeholder={$form.id ? 'Num' : ''}
						class='rounded-e-none border-e-0'
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
				<div class="w-1/2">
					<select
						class='rounded-s-none'
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
			</div>
			{#if $form.id}
				<!-- Accept Edit Ingredient -->
				<button
					class={`${$styleStore.btnPrimary} w-8`}
					on:click={() => (ingredient.editable = false)}>
						<iconify-icon icon="ic:baseline-check" />
					</button
				>
			{:else}
			<!-- Add New Ingredient -->
				<button class={`${$styleStore.btnPrimary} w-1/4`}>Add</button>
			{/if}
			<slot />
		</div>
	</div>
	{#if action === '?/create'}
	<div class="mt-4">
		<p class={$styleStore.label}>Preview</p>
		<div class={$styleStore.preview}>
			<div class="lg:w-1/3">{$form.name ? $form.name : 'Ingredient Name'}</div>
			<div class="lg:w-1/3">{$form.category ? $form.category : 'Category'}</div>
			<div class="lg:w-1/3">${$form.costPer}/{$form.numberOf}{$form.measurementUnit ? $form.measurementUnit : 'g'}</div>
		</div>
	</div>
	{/if}
</form>
