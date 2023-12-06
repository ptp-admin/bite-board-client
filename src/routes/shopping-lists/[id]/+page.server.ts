import type { PageServerLoad } from './$types';
import { axiosHandler } from '../../../lib/axiosHandler';
import { error } from '@sveltejs/kit';
import type { ShoppingList } from '../../../../types/data';

export const load = (async (event) => {
  const shoppingList = await axiosHandler({
    method: 'get',
    route: `/shopping-lists/${event.params.id}`
  });
	const recipes = await axiosHandler({
		method: 'get',
		route: `/recipes/`
	});

	const shoppingListTyped: ShoppingList = shoppingList.data;

	// return if successful
	if (shoppingList) return { shoppingList: shoppingListTyped, recipes: recipes.data.reverse() };
	// error if not
	throw error(404, 'Not found');
}) satisfies PageServerLoad;

export const actions = {
  deleteRecipe: async ({ request }) => {
    const data = await request.formData();
    const recipeId = data.get('recipeId')
    const shoppingListId = data.get('shoppingListId');

    const response = await axiosHandler({
      method: 'delete',
      route: `/shopping-lists/${shoppingListId}/recipes/${recipeId}`,
    });
    return { success: true };
  },
};