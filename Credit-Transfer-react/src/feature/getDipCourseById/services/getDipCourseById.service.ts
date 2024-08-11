import services from "@/config/axiosConfig"
import { IGetDipCourseById } from "../interface/getDipCourseById";


export const getDipcourseById = async (dipCourseId: string) => {
    const response = await services.get(`/api/dip/`, {
        params: {
            dipCourseId: dipCourseId
        }
    });
    return response.data;
}