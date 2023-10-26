import type { PageServerLoad } from './$types';
import { axiosHandler } from '../../../lib/axiosHandler';
import { error, redirect } from '@sveltejs/kit';
import { TINY_API_KEY } from '$env/static/private';
import type { Ingredient, Recipe } from '../../../../types/data';
import { superValidate } from 'sveltekit-superforms/server';
import { newRecipeSchema } from '../../../schemas';

export const load = (async (event) => {
	const recipe = await axiosHandler({
		method: 'get',
		route: `/recipes/${event.params.id}`
	})
	const form = await superValidate(event, newRecipeSchema);
	const response = await fetch('http://localhost:3456/ingredients');
	const ingredients: Ingredient[] = await response.json();

	if (recipe) {
		return { recipe: recipe.data, form, ingredients, apiKey: TINY_API_KEY }
	} else {
		throw error(404, 'Not found');
	}
}) satisfies PageServerLoad;

export const actions = {
	delete: async (request) => {
		const { id } = request.params

		const res = await axiosHandler({
			method: 'delete',
			route: `/recipes/${id}`
		});
		const error = res.data

		if (res.status === 200) {
			throw redirect(307, '/recipes/');
		} else {
			throw error(404, 'error')
		}
	}
};
