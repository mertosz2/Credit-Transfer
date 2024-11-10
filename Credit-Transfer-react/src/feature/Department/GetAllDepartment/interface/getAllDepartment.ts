export interface IGetAllDepartmentResponse {
  _embedded: IEmbedded
  page: IPage
}

export interface IEmbedded {
  departmentResponseList: IDepartmentResponseList[]
}

export interface IDepartmentResponseList {
  departmentId: number
  departmentName: string
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
