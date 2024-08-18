export const isValidNumberInput = (value: string): boolean => {
  if (value === "") return true
  if (/^4(\.0)?$/.test(value)) {
    return true
  }
  if (/^[1-3](\.[05]?)?$/.test(value)) {
    return true
  }
  return false
}
