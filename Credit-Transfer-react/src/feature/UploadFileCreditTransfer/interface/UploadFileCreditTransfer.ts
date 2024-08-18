import { ICreditTransferResponse } from "@/feature/CreditTransfer/interface/CreditTransfer"

export interface IUploadFileResponse {
  foundedDipCourseIdList: string[]
  totalFounded: number
  notFoundedDipCourseIdList: string[]
  totalNotFounded: number
  transferCreditResponseList: ICreditTransferResponse[]
  total: number
  duplicates?: string[]
}
