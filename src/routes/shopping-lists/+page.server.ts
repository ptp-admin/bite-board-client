import type { PageServerLoad } from './$types';

import { error, fail, redirect } from '@sveltejs/kit';
import { axiosHandler } from '../../lib/axiosHandler';
import { superValidate } from 'sveltekit-superforms/server';
import { newRecipeSchema } from '../../schemas';
import type { Recipe } from '../../../types/data';

export const load = (async () => {
	const shoppingLists = await axiosHandler({
    method: 'get',
    route: `/shopping-lists/`
  })
  const recipes = await axiosHandler({
    method: 'get',
    route: `/recipes/`
  })
  // return if successful
  if (shoppingLists) return {shoppingLists: shoppingLists.data.reverse(), recipes: recipes.data.reverse()}
  // error if not
  throw error(404, 'Not found');
}) satisfies PageServerLoad;

export const actions = {
	// create: async (event) => {
	// 	const form = await superValidate(event, newRecipeSchema);

	// 	// validation error case
	// 	if (!form.valid) {
	// 		return fail(400, { form });
	// 	}

	// 	const { name, method, servings, recipeIngredients } = form.data

	// 	const recipe: Recipe = {
	// 		name,
	// 		method: method || '',
	// 		servings,
	// 		recipeIngredients
	// 	}

	// 	const response = await axiosHandler({
	// 		method: 'post',
	// 		route: '/recipes',
	// 		data: recipe
	// 	});
	// 	const { message, recipeId } = response.data

	// 	throw redirect(307, `/recipes/${recipeId}`);
	// },

	// update: async (event) => {
	// 	const form = await superValidate(event, newRecipeSchema);

	// 	// validation error case
	// 	if (!form.valid) {
	// 		return fail(400, { form });
	// 	}

	// 	const { id, name, method, servings, recipeIngredients } = form.data

	// 	const recipe: Recipe = {
	// 		id,
	// 		name,
	// 		method: method || '',
	// 		servings,
	// 		recipeIngredients
	// 	}

	// 	await axiosHandler({
	// 		method: 'put',
	// 		route: `/recipes/${id}`,
	// 		data: recipe
	// 	});

	// 	const response = await axiosHandler({
	// 		method: 'get',
	// 		route: `/recipes/${id}`
	// 	})

	// 	return { success: true, form, recipe: response.data };
	// },

	addToShoppingList: async ({request}) => {
		const data = await request.formData();
		const recipe = JSON.parse(data.get('recipe') as string);
		const shoppingListId = data.get('shoppingListId');
    
    const {recipeId, servings} = recipe;
		const response = await axiosHandler({
			method: 'post',
			route: `/shopping-lists/${shoppingListId}/recipes/`,
			data: {recipeId, servings}
		});
		return { success: true };
	}
};
