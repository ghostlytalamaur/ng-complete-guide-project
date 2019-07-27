import { Ingredient } from '../../shared/models/ingredient';

export class Recipe {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly imagePath: string,
    public readonly ingredients: ReadonlyArray<Ingredient>
  ) {
  }

  update(fields: { id: string } & Partial<Recipe>): Recipe {
    return new Recipe(
      fields.id,
      fields.name || this.name,
      fields.description || this.description,
      fields.imagePath || this.imagePath,
      fields.ingredients || this.ingredients
    );
  }
}
