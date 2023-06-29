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