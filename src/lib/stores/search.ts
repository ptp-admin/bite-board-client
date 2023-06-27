import type { Ingredient, SearchableIngredient } from '../../../types/ingredients'
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
	data: SearchableIngredient[],
	filtered: SearchableIngredient[],
	sortBy?: SortBy
}

export const searchStore = writable('')

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

export const searchHandler = (search: string, ingredients: SearchableIngredientsStructure) => {
	const searchTerm = search.toLowerCase() || ""

	// Search filter
	const filteredIngredients = ingredients.data.filter((item) => {	
			return item.searchKeywords.toLowerCase().includes(searchTerm)
	}).reverse()

	// const sortByArray = _.map(ingredients.sortBy, (value, key) => {
	// 	if (value)
	// 		return key
	// }).filter(boolean => boolean)
	
	// if (sortByArray.length > 0){
	// 	const sortedDefinedArrays = ingredients.filtered.reduce((r, current) => {
	// 		const sortByIngredientProperties = sortByArray.filter(e => e !== 'reverse' && e !== 'showUndefined')

	// 		const defined = sortByIngredientProperties.map(property => {
	// 			return Boolean(current[property])
	// 		})

	// 		defined.every(bool => bool)
	// 		? r.defined.push(current)
	// 		: r.undefined.push(current)

	// 		return r
	// 	}, {
	// 		defined: [],
	// 		undefined: []
	// 	});
		
	// 	ingredients.filtered = _.sortBy(sortedDefinedArrays.defined, sortByArray)
	// 	if (ingredients.sortBy.reverse) ingredients.filtered = ingredients.filtered.reverse()
	// 	if (ingredients.sortBy.showUndefined) ingredients.filtered = ingredients.filtered.concat(sortedDefinedArrays.undefined)
	// }
	return filteredIngredients
}
