import { readable } from "svelte/store"

// Used mostly for elements which are repeated numerous times across pages
export const styleStore = readable({
	badge: 'badge h-6 variant-outline-tertiary',
	btnError: 'btn btn-sm h-8 rounded-lg bg-error-400',
	btnErrorOutline: 'btn btn-sm h-8 rounded-lg variant-outline-error',
	btnPrimary: 'btn btn-sm h-8 bg-primary-500 rounded-lg',
	btnPrimaryOutline: 'btn btn-sm h-8 variant-outline-primary rounded-lg',
	btnSecondary: 'btn btn-sm h-8 bg-secondary-500 rounded-lg',
	btnSecondaryOutline: 'btn btn-sm h-8 variant-outline-secondary rounded-lg',
	btnSurface: 'btn btn-sm bg-surface-500 rounded-lg h-8',
	btnSurfaceOutline: 'btn btn-sm variant-outline-surface rounded-lg h-8',
	btnTertiary: 'btn btn-sm h-8 bg-tertiary-500 rounded-lg',
	btnTertiaryOutline: 'btn btn-sm h-8 variant-outline-tertiary rounded-lg',
	card: 'card flex flex-col gap-6 p-6 bg-surface-600/10',
	dialog: 'w-full bg-surface-300 rounded-lg',
	h1: '-mt-1 font-semibold text-2xl',
	h2: '-mt-1 font-semibold text-xl',
	h3: '-mt-1 font-semibold text-lg',
	input: 'input bg-surface-50 focus:outline-none focus:ring-0 focus:border-tertiary-500 h-8 py-1 px-2.5 rounded-lg border-surface-700',
	label: 'h-6 my-1 font-semibold',
	preview: 'rounded-lg bg-surface-100/30 py-2 px-3 flex flex-row items-center justify-between shadow-md',
	select: 'select h-8 py-1 px-1.5 bg-surface-50 focus:outline-none focus:ring-0 focus:border-tertiary-500 rounded-lg border-surface-700',
})