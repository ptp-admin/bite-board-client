import { z } from 'zod'

export const newIngredientSchema = z.object({
	id: z
		.coerce
		.number()
		.optional(),
  name: z
    .string({ required_error: 'Ingredient name is required' })
    .min(1, { message: 'Ingredient name is required' })
    .max(64, { message: 'Name must be less than 64 characters' })
    .trim(),
  costPer: z
    .coerce
    .number({ invalid_type_error: "Cost must be a number" })
    .nonnegative({ message: 'Cost per unit must not me negative' }),
  numberOf: z
    .coerce
    .number({invalid_type_error: "Unit must be a number"})
    .nonnegative({ message: 'Must not me negative' }),
  measurementUnit: z
    .string()
		.optional(),
  category: z
    .string({invalid_type_error: "Name must be a string"})
    .max(64, { message: 'Category name must be less than 64 characters' })
    .trim(),
})

export type NewIngredientSchema = typeof newIngredientSchema