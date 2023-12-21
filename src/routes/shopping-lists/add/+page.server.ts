import { axiosHandler } from '$lib/axiosHandler';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	addShoppingList: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');

		const response = await axiosHandler({
			method: 'post',
			route: `/shopping-lists/`,
			data: { name }
		});

		const { shoppingListId } = response.data;

        throw redirect(307, `/shopping-lists/${shoppingListId}`);
	}
};
