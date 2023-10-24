import type { PageServerLoad } from './$types';

import { error, fail, redirect } from '@sveltejs/kit';
import { axiosHandler } from '../../lib/axiosHandler';
import { superValidate } from 'sveltekit-superforms/server';
import { newRecipeSchema } from '../../schemas';
import type { Recipe } from '../../../types/data';

export const load = (async () => {
	const shoppingLists = await axiosHandler({
    method: 'get',
    route: `/shopping-lists/`
  })
  // return if successful
  if (shoppingLists) return {shoppingLists: shoppingLists.data.reverse()}
  // error if not
  throw error(404, 'Not found');
}) satisfies PageServerLoad;