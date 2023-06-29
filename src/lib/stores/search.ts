import type { Ingredient } from '../../../types/ingredients'
import _ from 'lodash'

import { writable } from 'svelte/store'

export type SortBy = {
	category: boolean,
	name: boolean,
	costPer: boolean,
	reverse: boolean,
	showUndefined: boolean
}

export type SearchableIngredientsStructure = {
	data: Ingredient[],
	filtered: Ingredient[],
	sortBy?: SortBy
}

export type SearchStore = {
	data: Ingredient[],
	filtered: Ingredient[],
	searchTerm: string,
	sortBy: SortBy
}

export const createSearchStore = (ingredients: Ingredient[]) => {
	const data = createSearchableIngredients(ingredients)

	const store = writable({
		data,
		filtered: data,
		searchTerm: '',
		sortBy: {
			category: false,
			name: false,
			costPer: false,
			reverse: false,
			showUndefined: false
		}
	})
	
	return store
}

export const createSearchableIngredients = (ingredients: Ingredient[]) => {
	return ingredients.map(ingredient => {
		return {
			...ingredient,
			searchKeywords: `${ingredient.name} ${ingredient.category}`,
			editable: false
		}
	})
}

export const searchableIngredientsStructure = (ingredients: Ingredient[]) => {
	const data = ingredients.map(ingredient => {
		return {
			...ingredient,
			searchKeywords: `${ingredient.name} ${ingredient.category}`,
			editable: false
		}
	})
	
	return {
		data,
		filtered: data,
		sortBy: {
			category: false,
			name: false,
			costPer: false,
			reverse: false,
			showUndefined: false
		}
	}
}

export const searchHandler = (store: SearchStore, ingredientData?: Ingredient[]) => {
	if (ingredientData) store.data = createSearchableIngredients(ingredientData)
	const searchTerm = store.searchTerm.toLowerCase() || ""

	// Search filter
	store.filtered = store.data.filter((item) => {	
			return item.searchKeywords.toLowerCase().includes(searchTerm)
	}).reverse()

	const sortByArray = _.map(store.sortBy, (value, key) => {
		if (value)
			return key
	}).filter(boolean => boolean)
	
	if (sortByArray.length > 0){
		const sortedDefinedArrays = store.filtered.reduce((r, current) => {
			const sortByIngredientProperties = sortByArray.filter(e => e !== 'reverse' && e !== 'showUndefined')

			const defined = sortByIngredientProperties.map(property => {
				return Boolean(current[property])
			})

			defined.every(bool => bool)
			? r.defined.push(current)
			: r.undefined.push(current)

			return r
		}, {
			defined: [],
			undefined: []
		});

		store.filtered = _.sortBy(sortedDefinedArrays.defined, sortByArray)
		if (store.sortBy.reverse) store.filtered = store.filtered.reverse()
		if (store.sortBy.showUndefined) store.filtered = store.filtered.concat(sortedDefinedArrays.undefined)
	}
}