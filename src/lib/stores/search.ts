import type { Ingredient } from '../../../types/data'
import _ from 'lodash'

import { writable } from 'svelte/store'

export type SortBy = {
	category: boolean,
	name: boolean,
	costIsDefined: boolean,
	reverse: boolean,
	showUndefined: boolean
}

export type SortByOptions = 'category' | 'name' | 'costIsDefined'

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

	const store = writable<SearchStore>({
		data,
		filtered: data,
		searchTerm: '',
		sortBy: {
			category: false,
			name: false,
			costIsDefined: false,
			reverse: false,
			showUndefined: false
		}
	})
	
	return store
}

export const createSearchableIngredients = (ingredients: Ingredient[]) => {
	return ingredients.map(ingredient => {
		const costIsDefined = 
			ingredient.costPer != null && 
			ingredient.numberOf != null && 
			ingredient.measurementUnit != null &&
			ingredient.measurementUnit != ''
		return {
			...ingredient,
			searchKeywords: `${ingredient.name} ${ingredient.category}`,
			editable: false,
			costIsDefined
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
			costIsDefined: false,
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
		if (item.searchKeywords)
			return item.searchKeywords.toLowerCase().includes(searchTerm)
	}).reverse()

	/* 
	Returns an array of properties which the user has selected to sort Ingredients by. E.g.
	sortBy: {
		category: true,
		name: false,
		costIsDefined: true,
		reverse: true,
		showUndefined: false
	}
	returns ['category', 'costIsDefined', 'reversed'] 
	*/
	const sortByArray = _.map(store.sortBy, (value, key) => {
		if (value)
			return key
	}).filter(boolean => boolean)

	// Create arrays to catch sorted/filtered Ingredients
	const definedArray: Ingredient[] = []
	const undefinedArray: Ingredient[] = []
	if (sortByArray.length > 0){
		store.filtered.forEach(ingredient => {
			// Remove 'reverse' and 'showUndefined' as they don't map to Ingredient properties
			const sortByIngredientProperties = sortByArray.filter(e => e !== 'reverse' && e !== 'showUndefined')
			// Map over the remaining sortBy properties, and check whether the ingredient has a value assigned to that property
			const defined = sortByIngredientProperties.map(property => {
				return Boolean(ingredient[property as SortByOptions])
			})
			// If all of the selected properties are defined, push to defined, else, push to undefined
			defined.every(bool => bool)
			? definedArray.push(ingredient)
			: undefinedArray.push(ingredient)
		})

		// TODO this lodash sortBy function is case-sensitive. Change it to be case-insensitive.
		store.filtered = _.sortBy(definedArray, sortByArray) as Ingredient[]
		if (store.sortBy.reverse) store.filtered = store.filtered.reverse()
		if (store.sortBy.showUndefined) store.filtered = store.filtered.concat(undefinedArray)
	}
}