export interface User {
  name: string;
  birthDate: Date;
  expectedLifespan: number;
  id?: string;
}

export type NewUser = Omit<User, 'id'>;

export const isValidUser = (user: User): boolean => {
  return (
    typeof user.name === 'string' &&
    user.name.length > 0 &&
    user.birthDate instanceof Date &&
    typeof user.expectedLifespan === 'number' &&
    user.expectedLifespan > 0
  );
}; 