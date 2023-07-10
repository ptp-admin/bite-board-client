import type { PageServerLoad } from './$types';
import type { Ingredient, Recipe } from '../../../../types/data';
import { fail, redirect } from '@sveltejs/kit';
import { newRecipeSchema } from '../../../schemas';
import { superValidate } from 'sveltekit-superforms/server';
import { axiosHandler } from '../../../lib/axiosHandler';
import { TINY_API_KEY } from '$env/static/private';


export const load = (async (event) => {
	const form = await superValidate(event, newRecipeSchema);
	const response = await fetch('http://localhost:3456/ingredients');
	const ingredients: Ingredient[] = await response.json();

	return { form, ingredients, apiKey: TINY_API_KEY };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
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
	}
};