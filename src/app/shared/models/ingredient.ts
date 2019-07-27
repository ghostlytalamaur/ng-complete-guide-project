import * as fp from 'fp-ts';

export class Ingredient {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly amount: number
  ) {
  }

  static sameName(name: string): (ingredient: Ingredient) => boolean {
    name = name.toLocaleLowerCase();
    return (ingredient => ingredient.name.toLocaleLowerCase() === name);
  }

  static notSameName(name: string): (ingredient: Ingredient) => boolean {
    return fp.function.not(Ingredient.sameName(name));
  }

  static notSameId(id: string): (ingredient: Ingredient) => boolean {
    return ingredient => ingredient.id !== id;
  }

  merge(ingredient: Partial<Ingredient>): Ingredient {
    return new Ingredient(this.id, this.name, this.amount + (ingredient.amount ? ingredient.amount : 0));
  }

  update(ingredient: Partial<Ingredient>): Ingredient {
    return new Ingredient(this.id, this.name, (ingredient.amount ? ingredient.amount : this.amount));
  }
}

export function findIngredientIndex(ingredients: Ingredient[], name: string): number {
  if (!ingredients || !name) {
    return -1;
  }
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
