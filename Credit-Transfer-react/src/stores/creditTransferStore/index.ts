import { IDataSection } from "@/feature/CreditTransfer/interface/CreditTransfer"
import { encryptedStorage } from "@/util/encryptedStorage"
import create from "zustand"
import { devtools, persist } from "zustand/middleware"

interface State {
  data: IDataSection | null
}

interface Actions {
  onSetCreditTransferData: (data: IDataSection) => void
}

interface ICreditTransferStore extends State, Actions {}

const initialState: State = {
  data: {
    firstSectionList: [],
    secondSectionList: [],
    thirdSectionList: [],
    dipCourseId: "",
    universityCourse: {
      uniId: 0,
      uniCourseId: "",
      uniCourseName: "",
      uniCredit: 0
    },
    transferable: false,
    id: 0,
    dipCourseName: "",
    dipCredit: 0,
    grade: 0,
    totalUniCredit: 0,
    totalDipCredit: 0
  }
}

const useCreditTransferStore = create<ICreditTransferStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        onSetCreditTransferData: (_data) =>
          set(() => ({ data: _data }), false, "CreditTransfer/OnsetData")
      }),
      {
        name: "credit-transfer-store",
        storage: encryptedStorage
      }
    )
  )
)

export const selectOnSetCreditTransferData = (state: ICreditTransferStore) =>
  state.onSetCreditTransferData

export const selectCreditTransferData = (state: ICreditTransferStore) =>
  state.data
export default useCreditTransferStore
