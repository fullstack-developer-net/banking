export const errorLookup = {
  invalidEmail: 'Invalid email',
  required: 'This field is required',
  minLength: 'Minimum length is 6 characters',
  emailExists: 'Email already exists',
  email: 'Invalid email'
};

export function getErrorMessage(errorCode: string): string {
  return errorLookup[errorCode] || 'This field is invalid';
}
