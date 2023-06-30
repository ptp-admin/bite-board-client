export interface Ingredient {
	id: number,
  name: string,
  category?: string,
	costPer?: number,
  numberOf?: number,
	editable: boolean,
  measurementUnit?: string,
	searchKeywords: string
}

export interface RecipeIngredient extends Ingredient {
  recipeNumberOf?: number;
  recipeMeasurementUnit?: string;
  recipeId?: number;
  derivedCost?: number;
}

export interface Recipe {
  id?: number;
  name: string;
  method: string;
  servings?: number;
  recipeIngredients?: RecipeIngredient[];
  costPerServe?: number;
}