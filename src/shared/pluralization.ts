export function pluralizeKey(baseKey: string, number: number) {
  if (number === 1) return `${baseKey}.One`;
  return `${baseKey}.Other`;
}
