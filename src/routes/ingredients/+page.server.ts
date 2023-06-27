/** @type {import('./$types').PageServerLoad} */
/** @type {import('./$types').Actions} */
import type { Ingredient, DatabaseIngredient } from '../../../types/ingredients'

import { superValidate } from 'sveltekit-superforms/server'
import { error, fail } from '@sveltejs/kit';
import { axiosHandler } from '../../lib/axiosHandler.js';
import { newIngredientSchema } from '../../schemas';
import { searchableIngredientsStructure } from '$lib/stores/search';

export const load = async (event) => {
	const form = await superValidate(event, newIngredientSchema);
  const response = await fetch('http://localhost:3456/ingredients')
	const ingredientData = await response.json()

	const ingredients: Ingredient[] = ingredientData.map((ingredient: DatabaseIngredient): Ingredient => {
    return {
        id: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
        costPer: ingredient.cost_per,
        measurementUnit: ingredient.measurement_unit,
        numberOf: ingredient.number_of,
				editable: false
    };
	});

  if (ingredients){
		const searchableIngredients = searchableIngredientsStructure(ingredients);
    return {
			searchableIngredients,
			ingredients,
			form
		}
  }
	
  throw error(404, 'Not found');
}

export const actions = {
  create: async (event) => {
		const form = await superValidate(event, newIngredientSchema)

		// validation error case
		if (!form.valid) {
			return fail(400, { form })
		}

		// validation succes case
		await axiosHandler({
			method: 'post',
			route: '/ingredients',
			data: form.data
		})

		return {success: true, form}
  },

  // delete: async ({request}) => {
  //   const formData = await request.formData()
  //   const id = formData.get('id')

  //   await axiosHandler({
  //     method: 'delete',
  //     route: `/ingredients/${id}`
  //   })
    
  //   return {success: true}
  // },

  update: async (event) => {
    const form = await superValidate(event, newIngredientSchema)

		// validation error case
		if (!form.valid) {
			return fail(400, { form })
		}

		await axiosHandler({
			method: 'put',
			route: `/ingredients/${form.data.id}`,
			data: form.data
		})
		return {success: true, form}
  }
}
