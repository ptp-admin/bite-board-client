import type { PageServerLoad } from './$types';

import { error, fail, redirect } from '@sveltejs/kit';
import { axiosHandler } from '../../lib/axiosHandler';
import { superValidate } from 'sveltekit-superforms/server';
import { newRecipeSchema } from '../../schemas';
import type { Recipe } from '../../../types/data';

export const load = (async () => {
	const recipes = await axiosHandler({
    method: 'get',
    route: `/recipes/`
  })
	const shoppingLists = await axiosHandler({
    method: 'get',
    route: `/shopping-lists/`
  })
  // return if successful
  if (recipes && shoppingLists) return {recipes: recipes.data.reverse(), shoppingLists: shoppingLists.data.reverse()}
  // error if not
  throw error(404, 'Not found');
}) satisfies PageServerLoad;

export const actions = {
	create: async (event) => {
		const form = await superValidate(event, newRecipeSchema);

		// validation error case
		if (!form.valid) {
			return fail(400, { form });
		}

		const { name, method, servings, recipeIngredients } = form.data

		const recipe: Recipe = {
			name,
			method: method || '',
			servings,
			recipeIngredients
		}

		const response = await axiosHandler({
			method: 'post',
			route: '/recipes',
			data: recipe
		});
		const { message, recipeId } = response.data

		throw redirect(307, `/recipes/${recipeId}`);
	},

	update: async (event) => {
		const form = await superValidate(event, newRecipeSchema);

		// validation error case
		if (!form.valid) {
			return fail(400, { form });
		}

		const { id, name, method, servings, recipeIngredients } = form.data

		const recipe: Recipe = {
			id,
			name,
			method: method || '',
			servings,
			recipeIngredients
		}

		await axiosHandler({
			method: 'put',
			route: `/recipes/${id}`,
			data: recipe
		});

		const response = await axiosHandler({
			method: 'get',
			route: `/recipes/${id}`
		})

		return { success: true, form, recipe: response.data };
	},

	addToShoppingList: async ({request}) => {
		const data = await request.formData();
		const recipeId = data.get('recipeId');
		const servings = data.get('servings');
		const shoppingListId = data.get('shoppingListId');
		
		const response = await axiosHandler({
			method: 'post',
			route: `/shopping-lists/${shoppingListId}/recipes/`,
			data: {recipeId, servings}
		});
		return { success: true };
	}
};