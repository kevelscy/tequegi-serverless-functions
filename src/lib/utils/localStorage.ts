export const getLocalStorage = (key: string) => {
  const item = localStorage.getItem(key)

  return !item ? null : JSON.parse(item)
}

export const setLocalStorage = (key: string, value) => localStorage.setItem(key, JSON.stringify(value))

export const removeLocalStorage = (key: string) => localStorage.removeItem(key)
