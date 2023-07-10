<script lang="ts">
	export let showModal: boolean;

	let dialog: any; // HTMLDialogElement
	export let dialogClass = ''

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	class={dialogClass}
	bind:this={dialog}
	on:close|preventDefault={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<div on:click|stopPropagation>
		<slot name="header" />
		<slot />
		<div class="flex gap-1">
			<button class="btn btn-sm variant-soft-surface rounded-lg" on:click|preventDefault={() => dialog.close()}>
				Cancel
			</button>
			<slot name="button" />
		</div>
	</div>
</dialog>

<style>
	dialog {
		max-width: 60%;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>