export interface User {
  readonly id: string;
  readonly email: string;
  readonly token: string;
  readonly tokenExpirationDate: string;
}

export function createUser(id: string, email: string, token: string, tokenExpirationDate: string): User {
  return { id, email, token, tokenExpirationDate };
}
