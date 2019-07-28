import * as uuid from 'uuid';

export class NotifyItem {
  public readonly id: string;

  constructor(
    public readonly message: string
  ) {
    this.id = uuid.v4();
  }
}
