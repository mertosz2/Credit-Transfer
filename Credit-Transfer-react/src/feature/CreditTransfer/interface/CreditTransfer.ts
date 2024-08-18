export interface ICreditTransferResponse {
  dipCourseId: any
  uniCredit: number
  diplomaCourseList: IDiplomaCourseList[]
  universityCourse: IUniversityCourse
  transferable: boolean
}

export interface IDiplomaCourseList {
  id: number
  dipCourseId: string
  dipCourseName: string
  dipCredit: number
  grade: number
}

export interface IUniversityCourse {
  uniId: number
  uniCourseId: string
  uniCourseName: string
  uniCredit: number
}

export interface ICreditResponseList {
  list: ICreditTransferResponse[]
}

export interface IFlatDiplomaCourseList extends IDiplomaCourseList {
  universityCourse: IUniversityCourse
  transferable: boolean
  originalIndex?: number
  isFirstInGroup?: boolean
  groupSize?: number
}
