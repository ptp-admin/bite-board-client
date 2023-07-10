import type { PageServerLoad } from './$types';
import type { Ingredient, Recipe } from '../../../../types/data';
import { newRecipeSchema } from '../../../schemas';
import { superValidate } from 'sveltekit-superforms/server';
import { TINY_API_KEY } from '$env/static/private';


export const load = (async (event) => {
	const form = await superValidate(event, newRecipeSchema);
	const response = await fetch('http://localhost:3456/ingredients');
	const ingredients: Ingredient[] = await response.json();

	return { form, ingredients, apiKey: TINY_API_KEY };
}) satisfies PageServerLoad;
