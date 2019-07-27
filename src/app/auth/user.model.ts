export class User {

  constructor(
    public readonly id: string,
    public readonly email: string,
    private readonly mToken: string,
    private readonly mTokenExpirationDate: Date
  ) {}


  get token(): string | null {
    if (!this.mTokenExpirationDate || new Date() > this.mTokenExpirationDate) {
      return null;
    }
    return this.mToken;
  }

  getTokenExpirationDuration(): number {
    return this.mTokenExpirationDate.getTime() - new Date().getTime();
  }

}
