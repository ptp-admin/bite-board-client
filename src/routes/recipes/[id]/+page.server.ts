import type { PageServerLoad } from './$types';
import { axiosHandler } from '../../../lib/axiosHandler';
import { error, redirect } from '@sveltejs/kit';

export const load = (async ({params}) => {
	const recipe = await axiosHandler({
		method: 'get',
		route: `/recipes/${params.id}`
	})

	if (recipe) {
		return {recipe: recipe.data}
	} else {
		throw error(404, 'Not found');
	}
}) satisfies PageServerLoad;

export const actions = {
		delete: async (request) => {
		const { id } = request.params 

		await axiosHandler({
			method: 'delete',
			route: `/recipes/${id}`
		});

		throw redirect(307, '/recipes/');
	}
};