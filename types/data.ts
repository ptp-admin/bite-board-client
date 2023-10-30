export interface Ingredient {
  id?: number,
  name: string,
  category?: string,
  costPer?: number,
  numberOf?: number,
  editable?: boolean,
  measurementUnit?: string,
  searchKeywords?: string,
  costIsDefined?: boolean
}

export interface RecipeIngredient extends Ingredient {
  recipeNumberOf?: number;
  recipeMeasurementUnit?: string;
  recipeId?: number;
  derivedCost?: number;
}

export interface Recipe extends ShoppingListRecipe {
  method: string;
  recipeIngredients?: RecipeIngredient[];
  costPerServe?: number;
  costAccuracy: number;
  editable?: boolean;
}

export interface ShoppingListRecipe {
  id?: number;
  name: string;
  servings?: number;
}

export interface ShoppingListIngredient {
  id?: number;
  name: string;
  category?: string;
  derivedCost?: number;
  numberOf?: number;
  unit?: string;
  recipesIds?: number[];
  checked: boolean;
}

export interface ShoppingList {
  id?: number;
  name: string,
  servings: number,
  cost: number,
  recipes: ShoppingListRecipe[]
  ingredients: ShoppingListIngredient[]
}