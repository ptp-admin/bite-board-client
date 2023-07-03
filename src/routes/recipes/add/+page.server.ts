import type { PageServerLoad } from './$types';
import type { Ingredient, Recipe } from '../../../../types/data';
import { fail, redirect } from '@sveltejs/kit';
import { newRecipeSchema } from '../../../schemas';
import { superValidate } from 'sveltekit-superforms/server';
import { axiosHandler } from '../../../lib/axiosHandler';


export const load = (async (event) => {
	const form = await superValidate(event, newRecipeSchema);
	const response = await fetch('http://localhost:3456/ingredients');
	const ingredients: Ingredient[] = await response.json();

	return { form, ingredients };
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

		await axiosHandler({
			method: 'post',
			route: '/recipes',
			data: recipe
		});
		throw redirect(307, '/recipes');
		// return { success: true, form };
	}
};