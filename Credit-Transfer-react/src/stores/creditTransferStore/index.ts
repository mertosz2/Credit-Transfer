import {
  ICreditTransferResponse,
  IDiplomaCourseList,
  IFlatDiplomaCourseList,
  IUniversityCourse
} from "@/feature/CreditTransfer/interface/CreditTransfer"
import { encryptedStorage } from "@/util/encryptedStorage"
import create from "zustand"
import { devtools, persist } from "zustand/middleware"

interface State {
  data: IFlatDiplomaCourseList[]
}

interface Actions {
  onSetCreditTransferData: (data: IFlatDiplomaCourseList[]) => void
}

// Combine state and actions into the store interface
interface ICreditTransferStore extends State, Actions {}

const initialState: State = {
  data: []
}

// Create the Zustand store
const useCreditTransferStore = create<ICreditTransferStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        onSetCreditTransferData: (_data) =>
          set(() => ({ data: _data }), false, "CreditTransfer/OnsetData")
      }),
      {
        name: "credit-transfer-store", // Changed name to be more descriptive
        storage: encryptedStorage
      }
    )
  )
)

// Export selectors
export const selectOnSetCreditTransferData = (state: ICreditTransferStore) =>
  state.onSetCreditTransferData

export const selectCreditTransferData = (state: ICreditTransferStore) =>
  state.data
export default useCreditTransferStore
