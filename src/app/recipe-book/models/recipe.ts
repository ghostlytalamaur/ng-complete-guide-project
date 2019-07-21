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
}
