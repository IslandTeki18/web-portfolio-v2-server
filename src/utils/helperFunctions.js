export function breakStringDownToArray(str) {
  if (typeof str !== 'string') return false;
  return str.split(",");
}