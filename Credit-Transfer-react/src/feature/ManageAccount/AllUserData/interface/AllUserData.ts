export interface IAllUserResponse {
  _embedded: Embedded
  page: IPage
}

export interface Embedded {
  usersResponseList: IUsersResponseList[]
}

export interface IUsersResponseList {
  userId: number
  username: string
  fullName: string
  phone: string
  departmentName: string
  role: string
}

export interface IPage {
  size: number
  totalElements: number
  totalPages: number
  number: number
}
