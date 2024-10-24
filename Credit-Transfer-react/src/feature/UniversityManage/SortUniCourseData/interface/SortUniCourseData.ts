import { IUniCourseResponse } from "../../GetAllUniCourse/interface/GetAllUniCourse"

export interface ISortUniArgs {
  data: IUniCourseResponse
  key: TUniKey
  direction: boolean
}
export type TUniKey =
  | "uniCourseId"
  | "uniCourseName"
  | "uniCredit"
  | "preSubject"
  | string
