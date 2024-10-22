export interface IDipCourseRespone {
  _embedded: Embedded
  page: IPage
}
export interface Embedded {
  diplomaCourseResponseList: IDiplomaCourseResponseList[]
}

export interface IDiplomaCourseResponseList {
  id: number
  dipCourseId: string
  dipCourseName: string
  dipCredit: number
  uniCourseId: string
  uniCourseName: string
  uniCredit: number
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
}

export interface IPage {
  size: number
  totalElements: number
  totalPages: number
  number: number
}
