import {
  ICreditTransferResponse,
  IFlatDiplomaCourseList
} from "@/feature/CreditTransfer/interface/CreditTransfer"

// export const reverseFlattenData = (
//   _flatData: IFlatDiplomaCourseList[]
// ): ICreditTransferResponse[] => {
//   const groupedData = _flatData.reduce((acc, item) => {
//     const { universityCourse, transferable, ...courseData } = item

//     let existingEntry = acc.find(
//       (entry) => entry.universityCourse === universityCourse
//     )

//     if (!existingEntry) {
//       existingEntry = {
//         dipCourseId: "",
//         uniCredit: 0,
//         universityCourse,
//         transferable,
//         diplomaCourseList: []
//       }
//       acc.push(existingEntry)
//     }

//     existingEntry.diplomaCourseList.push(courseData)

//     return acc
//   }, [] as ICreditTransferResponse[])

//   return groupedData
// }

export const flattenData = (data: ICreditTransferResponse[]) => {
  return data.reduce((acc: IFlatDiplomaCourseList[], item) => {
    item.diplomaCourseList.forEach((course, index) => {
      acc.push({
        ...course,
        universityCourse: item.universityCourse,
        transferable: item.transferable,
        isFirstInGroup: index === 0, // mark first item in each group
        groupSize: item.diplomaCourseList.length // size of the group
      })
    })
    return acc
  }, [])
}
// export const flattenData2 = (data: ICreditTransferResponse[] | undefined) => {
//   return data?.reduce((acc: IFlatDiplomaCourseList[], item) => {
//     item.diplomaCourseList.forEach((course, index) => {
//       acc.push({
//         ...course,
//         universityCourse: item.universityCourse,
//         transferable: item.transferable,
//         isFirstInGroup: index === 0, // mark first item in each group
//         groupSize: item.diplomaCourseList.length // size of the group
//       })
//     })
//     return acc
//   }, [])
// }
