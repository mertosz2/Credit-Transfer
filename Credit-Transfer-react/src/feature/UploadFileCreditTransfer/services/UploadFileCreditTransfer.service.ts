import services from "@/configs/axiosConfig"
import { IUploadFileResponse } from "../interface/UploadFileCreditTransfer"

export const UploadFileCreditTransfer = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file) // เพิ่มไฟล์ลงใน FormData

  const response = await services.post<IUploadFileResponse>(
    `api/transfer/import/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data" // กำหนด header ให้ถูกต้อง
      }
    }
  )

  return response.data
}
