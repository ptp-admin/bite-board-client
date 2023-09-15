<script lang="ts">
	import { styleStore } from "$lib/stores/styles";
	export let showModal: boolean;
	export let dialogClass = $styleStore.dialog

	let dialog: any; // HTMLDialogElement
	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	class={dialogClass}
	bind:this={dialog}
	on:close|preventDefault={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<div class={$styleStore.card} on:click|stopPropagation>
		<slot name="header" />
		<slot />
		<div class="flex gap-1 place-content-end">
			<button class={$styleStore.btnSurface} on:click|preventDefault={() => dialog.close()}>
				Cancel
			</button>
			<slot name="button" />
		</div>
	</div>
</dialog>

<style>
	dialog {
		max-width: 90%;
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
</style>