import type { PageServerLoad } from './$types';
import { axiosHandler } from '../../../lib/axiosHandler';
import { error } from '@sveltejs/kit';

export const load = (async (event) => {
	const recipe = await axiosHandler({
		method: 'get',
		route: `/shopping-lists/${event.params.id}`
	})
    
	if (recipe) {
		return {shoppingList: recipe.data}
	} else {
		// throw error(404, 'Not found');
	}
}) satisfies PageServerLoad;