import secureLocalStorage from "react-secure-storage"
import { PersistStorage } from "zustand/middleware"
import superjson from "superjson"

export const encryptedStorage: PersistStorage<any> = {
  getItem: async (name: string) => {
    const str = (await secureLocalStorage.getItem(name)) as string | null
    if (!str) {
      return null
    }
    return superjson.parse(str)
  },
  setItem: async (name, value) => {
    await secureLocalStorage.setItem(name, superjson.stringify(value))
  },
  removeItem: async (name) => await secureLocalStorage.removeItem(name)
}
