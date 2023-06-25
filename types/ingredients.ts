export interface DatabaseIngredient {
	id: number,
  name: string,
  category?: string,
	cost_per?: number,
  number_of?: number,
  measurement_unit?: string, // TODO add a type for the unit enum and assign that type to this field
}

export interface EmptyIngredient {
  name: string,
  category?: string,
	costPer?: number,
  numberOf?: number,
	editable: boolean,
  measurementUnit?: string, // TODO add a type for the unit enum and assign that type to this field
}

export interface Ingredient extends EmptyIngredient {
	id: number
}

export interface SearchableIngredient extends Ingredient {
	searchKeywords: string
}