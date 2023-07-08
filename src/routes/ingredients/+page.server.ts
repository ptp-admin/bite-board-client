import type { PageServerLoad } from './$types';
import type { Ingredient } from '../../../types/data';
import { superValidate } from 'sveltekit-superforms/server';
import { error, fail } from '@sveltejs/kit';
import { axiosHandler } from '../../lib/axiosHandler.js';
import { newIngredientSchema } from '../../schemas';
import { searchableIngredientsStructure } from '$lib/stores/search';

export const load = (async (event) => {
	const form = await superValidate(event, newIngredientSchema);
	const response = await fetch('http://localhost:3456/ingredients');
	const ingredients: Ingredient[] = await response.json();

	if (ingredients) {
		const searchableIngredients = searchableIngredientsStructure(ingredients);
		return {
			searchableIngredients,
			ingredients,
			form
		};
	}

	throw error(404, 'Not found');
}) satisfies PageServerLoad;

export const actions = {
	create: async (event) => {
		const form = await superValidate(event, newIngredientSchema);

		// validation error case
		if (!form.valid) {
			return fail(400, { form });
		}

		// validation success case
		const response = await axiosHandler({
			method: 'post',
			route: '/ingredients',
			data: form.data
		});

		const { data } = response

		return { success: true, form, id: data.id };
	},

	update: async (event) => {
		const form = await superValidate(event, newIngredientSchema);

		// validation error case
		if (!form.valid) {
			return fail(400, { form });
		}

		await axiosHandler({
			method: 'put',
			route: `/ingredients/${form.data.id}`,
			data: form.data
		});
		return { success: true, form };
	},

	delete: async (event) => {
		const form = await superValidate(event, newIngredientSchema);
		const id = form.data.id;

		await axiosHandler({
			method: 'delete',
			route: `/ingredients/${id}`
		});

		return { success: true, form };
	}
};
