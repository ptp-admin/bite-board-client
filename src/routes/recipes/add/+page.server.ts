import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { newRecipeSchema } from '../../../schemas';
import { superValidate } from 'sveltekit-superforms/server';
import { axiosHandler } from '../../../lib/axiosHandler';
import type { Recipe } from '../../../../types/data';

export const load = (async (event) => {
	const form = await superValidate(event, newRecipeSchema);

	return form;
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, newRecipeSchema);

		// validation error case
		if (!form.valid) {
			return fail(400, { form });
		}

		const { name, method, servings } = form.data

		const recipe: Recipe = {
			name,
			method: method || '',
			servings
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