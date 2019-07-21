export class Ingredient {
  constructor(
    public readonly name: string,
    public readonly amount: number
  ) {
  }

  merge(ingredient: Partial<Ingredient>): Ingredient {
    return new Ingredient(this.name, this.amount + (ingredient.amount ? ingredient.amount : 0));
  }
}

export function findIngredientIndex(ingredients: Ingredient[], name: string): number {
  name = name.toLocaleLowerCase();
  return ingredients.findIndex(i => i.name.toLocaleLowerCase() === name);
}

export function findIngredient(ingredients: Ingredient[], name: string): Ingredient | undefined {
  const foundIndex = findIngredientIndex(ingredients, name);
  if (foundIndex >= 0) {
    return ingredients[foundIndex];
  } else {
    return undefined;
  }
}
