export interface IUniCourseResponse {
  _embedded: Embedded
  page: IPage
}

export interface Embedded {
  uniCourseResponseList: IUniCourseResponseList[]
}

export interface IUniCourseResponseList {
  uniId: number
  uniCourseId: string
  uniCourseName: string
  uniCredit: number
  preSubject: string
  courseCategory: string
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

export interface ISearchUniResponse {
  uniCourseId: string
  uniCourseName: string
  courseCategory: string
  uniCredit: string
  preSubject: string
}
