import type { PageServerLoad } from './$types';
import { axiosHandler } from '../../../lib/axiosHandler';
import { error } from '@sveltejs/kit';

export const load = (async ({params}) => {
	const recipe = await axiosHandler({
		method: 'get',
		route: `/recipes/${params.id}`
	})

	// return if successful
	if (recipe) return {recipe: recipe.data}
	// error if not
	throw error(404, 'Not found');
}) satisfies PageServerLoad;