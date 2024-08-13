export interface ICreditTransferResponse {
  diplomaCourseList: IDiplomaCourseList[];
  universityCourse: IUniversityCourse;
  transferable: boolean;
}

export interface IDiplomaCourseList {
  id: number;
  dipCourseId: string;
  dipCourseName: string;
  dipCredit: number;
  grade: number;
}

export interface IUniversityCourse {
  uniId: number;
  uniCourseId: string;
  uniCourseName: string;
  uniCredit: number;
}

export interface ICreditResponseList {
  list: ICreditTransferResponse[];
}
