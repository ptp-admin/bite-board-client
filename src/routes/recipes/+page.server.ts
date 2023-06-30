import type { PageServerLoad } from './$types';

import { error } from '@sveltejs/kit';
import { axiosHandler } from '../../lib/axiosHandler';

export const load = (async () => {
	const recipes = await axiosHandler({
    method: 'get',
    route: `/recipes/`
  })
  // return if successful
  if (recipes) return {recipes: recipes.data}
  // error if not
  throw error(404, 'Not found');
}) satisfies PageServerLoad;