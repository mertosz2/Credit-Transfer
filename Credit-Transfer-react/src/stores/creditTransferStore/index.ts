import {
  ICreditTransferResponse,
  IDataSection,
  IDiplomaCourseList,
  IFlatDiplomaCourseList,
  IUniversityCourse
} from "@/feature/CreditTransfer/interface/CreditTransfer"
import { encryptedStorage } from "@/util/encryptedStorage"
import create from "zustand"
import { devtools, persist } from "zustand/middleware"

interface State {
  data: IDataSection | null
}

interface Actions {
  onSetCreditTransferData: (data: IDataSection) => void
}

// Combine state and actions into the store interface
interface ICreditTransferStore extends State, Actions {}

const initialState: State = {
  data: {
    firstSectionList: [],
    secondSectionList: [],
    thirdSectionList: [],
    dipCourseId: "", // from IFlatDiplomaCourseList
    universityCourse: {
      uniId: 0,
      uniCourseId: "",
      uniCourseName: "",
      uniCredit: 0
    }, // from ICreditTransferResponse
    transferable: false, // from ICreditTransferResponse
    id: 0,
    dipCourseName: "", // Make sure to initialize this if it exists in IFlatDiplomaCourseList
    dipCredit: 0, // Make sure to initialize this if it exists in IFlatDiplomaCourseList
    grade: 0 // Make sure to initialize this if it exists in IFlatDiplomaCourseList
  }
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
