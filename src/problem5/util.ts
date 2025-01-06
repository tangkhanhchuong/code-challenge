export const isValidId = (id: string): boolean => {
  return /^-?\d+$/.test(id);
}