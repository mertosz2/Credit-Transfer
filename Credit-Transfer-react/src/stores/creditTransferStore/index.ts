import {
  IDiplomaCourseList,
  IUniversityCourse,
} from "@/feature/CreditTransfer/interface/CreditTransfer";
import { encryptedStorage } from "@/util/encryptedStorage";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

// ...import statements
interface State {
    dipCourseData: IDiplomaCourseList[];
    uniCourseData : IUniversityCourse
}

interface Actions {
    onSetCreditTransferData: (data: IDiplomaCourseList[]) => void;
    onSetUniversityCourseData: (data: IUniversityCourse) => void;
}

interface ICreditTransferStore extends State, Actions {}

const initialState: State = {
    dipCourseData: [],
    uniCourseData:{
        uniId:0,
        uniCourseId:"",
        uniCourseName:"",
        uniCredit:0
        
    }
};

const useCreditTransferStore = create<ICreditTransferStore>()(
    devtools(
        persist(
            (set) => ({
                ...initialState,
                onSetCreditTransferData: (newData) => set({ dipCourseData: newData }),
                onSetUniversityCourseData: (newData) => set({ uniCourseData: newData }),
            }),
            {
                name: "dipcoursedata-store",
                storage: encryptedStorage,
            }
        )
    )
);

export const selectOnSetCreditTransferData = (state: ICreditTransferStore) => state.onSetCreditTransferData;
export const selectOnSetUniversityCourseData = (state: ICreditTransferStore) => state.onSetUniversityCourseData;


export default useCreditTransferStore;

