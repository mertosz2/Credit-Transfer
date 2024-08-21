export const isValidNumberInput = (value: string): boolean => {
  if (value === "") return true
  if (/^4(\.0)?$/.test(value)) {
    return true
  }
  if (/^[1-3](\.[05]?)?$/.test(value)) {
    return true
  }
  if (/^0(\.0?)?$/.test(value)) {
    return true
  }
  return false
}

export const getStringAfterUnderscore = (str: string) => {
  const parts = str.split("_")
  return parts.length > 1 ? parts.slice(1).join("_") : ""
}
