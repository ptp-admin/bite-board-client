/** @type {import('./$types').PageServerLoad} */
/** @type {import('./$types').Actions} */

import { error } from '@sveltejs/kit';
import { axiosHandler } from '../../../lib/axiosHandler';
export async function load({ params }) {
		const recipe = await axiosHandler({
			method: 'get',
			route: `/recipes/${params.id}`
		})

		// return if successful
		if (recipe) return {recipe: recipe.data}
		// error if not
		throw error(404, 'Not found');
}