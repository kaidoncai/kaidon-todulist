export interface User {
  name: string;
  birthDate: Date;
  expectedLifespan: number;
  id?: string;
}

export type NewUser = Omit<User, 'id'>;

export interface ValidationError {
  field: keyof User;
  message: string;
}

export const validateUser = (user: NewUser | User): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!user.name || typeof user.name !== 'string' || user.name.trim().length === 0) {
    errors.push({ field: 'name', message: '用户名不能为空' });
  }

  if (!(user.birthDate instanceof Date) || isNaN(user.birthDate.getTime())) {
    errors.push({ field: 'birthDate', message: '出生日期无效' });
  }

  if (typeof user.expectedLifespan !== 'number' || user.expectedLifespan <= 0) {
    errors.push({ field: 'expectedLifespan', message: '预期寿命必须大于0' });
  }

  return errors;
};

export const isValidUser = (user: User): boolean => {
  return (
    typeof user.name === 'string' &&
    user.name.length > 0 &&
    user.birthDate instanceof Date &&
    typeof user.expectedLifespan === 'number' &&
    user.expectedLifespan > 0
  );
}; 