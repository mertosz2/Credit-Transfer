import { ITokenPayload } from "@/feature/authentication/interface/auth"
import { encryptedStorage } from "@/util/encryptedStorage"
import { useToast } from "@chakra-ui/react"
import { cloneDeep } from "lodash"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface State {
  data: ITokenPayload | null
}

interface Actions {
  onSetTokenData: (data: ITokenPayload) => void
  onReset: () => void
}

interface IProfileStore extends State, Actions {}
const initialState: State = {
  data: {
    role: [],
    user_id: 0,
    user_name: "",
    name: ""
  }
}

const resetState = cloneDeep(initialState)
const useProfileStore = create<IProfileStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        onSetTokenData: (_data) =>
          set(
            () => ({
              data: _data
            }),
            false,
            "profile/OnsetProfileData"
          ),
        onReset: () => {
          console.log("onReset called")
          set(() => resetState)
        }
      }),

      {
        name: "profile-store",
        storage: encryptedStorage
      }
    )
  )
)

export const selectOnsetProfileData = (state: IProfileStore) =>
  state.onSetTokenData
export const selectProfileData = (state: IProfileStore) => state.data
export const resetProfile = (state: IProfileStore) => state.onReset

export default useProfileStore
