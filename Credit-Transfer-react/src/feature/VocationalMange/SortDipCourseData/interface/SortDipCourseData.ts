import {
  IDipCourseRespone,
  IDiplomaCourseResponseList
} from "@/feature/getAllDipCourse/interface/getAllDipCourse"

export interface ISortDipArgs {
  data: IDipCourseRespone
  key: TDipKey
  direction: boolean
}
export type TDipKey =
  | "dipCourseId"
  | "dipCourseName"
  | "dipCredit"
  | "uniCourseId"
  | "uniCourseName"
  | "uniCredit"
  | string
