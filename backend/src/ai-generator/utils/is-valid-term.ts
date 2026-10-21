export function isValidTerm(term: string): boolean {
  if (!term || term.length < 2) return false;

  const hasLetter = /\p{L}/u.test(term);
  if (!hasLetter) return false;

  const letters = term.match(/\p{L}/gu) || [];
  return letters.length / term.length >= 0.4;
}
