export interface IDipCourseRespone {
  _embedded: Embedded
  page: Page
}
export interface Embedded {
  diplomaCourseResponseList: DiplomaCourseResponseList[]
}

export interface DiplomaCourseResponseList {
  id: number
  dipCourseId: string
  dipCourseName: string
  dipCredit: number
  uniCourseId: string
  uniCourseName: string
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
}

export interface Page {
  size: number
  totalElements: number
  totalPages: number
  number: number
}
