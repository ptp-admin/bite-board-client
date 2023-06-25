import type { PageServerLoad } from './$types';
import type { z } from 'zod';
import { newIngredientSchema } from '../../../schemas';
import { message, superValidate } from 'sveltekit-superforms/server';
import { error, fail } from '@sveltejs/kit';

const ingredientDB: z.infer<typeof newIngredientSchema>[] = [
	{
		"id": 136,
		"name": "Lamb Leg",
		"category": "Meat",
		"costPer": 289.99,
		"numberOf": 1,
		"measurementUnit": "kg"
	},
	{
		"id": 137,
		"name": "Mussels",
		"category": "Seafood",
		"costPer": 199.99,
		"numberOf": 1,
		"measurementUnit": "kg"
	},
	{
		"id": 138,
		"name": "Bacon",
		"category": "Meat",
		"costPer": 99.99,
		"numberOf": 500,
		"measurementUnit": "kg"
	}
];

const crudNewIngredientSchema = newIngredientSchema.extend({
	id: newIngredientSchema.shape.id.optional()
});

export const load = (async ({ params }) => {
	const ingredient = ingredientDB.find(i => i.id == params.id);

	if (params.id && !ingredient)	throw error(404);

	const form = await superValidate(ingredient, crudNewIngredientSchema)
    return { form, ingredientDB };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, crudNewIngredientSchema);
		console.log(form);
		
		if(!form.valid) {
			console.log(form);
			return fail(400, { form })
		}

		if (form.data.id) {

			// Update user
			const index = ingredientDB.findIndex(i => i.id == form.data.id)
			if (index == -1)
				throw error(404)
			
			ingredientDB[index] = {...form.data, id: form.data.id}

			return message(form, `${form.data.name} updated!`)
		} else {
			// Create user
			const id = Math.random();
			const ingredient = {...form.data, id}

			ingredientDB.push(ingredient)

			return message(form, `${form.data.name} added!`)
		}
	}
}