"use client";
import React, { useState } from "react";
import Button from "../Button";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useToast,
} from "@chakra-ui/react";
import useGetUploadFileCreditTransfer from "@/feature/UploadFileCreditTransfer/hooks/useGetUploadFileCreditTransfer";

const ImportButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState<File | undefined>(undefined);
  const toast = useToast();
  const { onUploadFile, isPending } = useGetUploadFileCreditTransfer();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const fileSizeInMB = selectedFile.size / 1024 / 1024; // Convert bytes to MB
      const allowedFileTypes = ["image/png", "image/jpeg", "application/pdf"];

      if (allowedFileTypes.includes(selectedFile.type)) {
        if (fileSizeInMB <= 10) {
          setFile(selectedFile);
        } else {
          toast({
            title: "File size should not exceed 10 MB.",
            status: "error",
            isClosable: true,
          });
          setFile(undefined);
        }
      } else {
        toast({
          title: "Only PNG, JPG, and PDF files are allowed.",
          status: "error",
          isClosable: true,
        });
        setFile(undefined);
      }
    } else {
      setFile(undefined);
    }
  };

//   const handleFileSubmit = async () => {
//     if (file) {
//       try {
//         const newFile = await onUploadFile(file);
//         console.log("list of", newFile.transferCreditResponseList);
//         if (newFile) {
//           const newIm = newFile.transferCreditResponseList;
//           const transferCreditResponseList = displayData || [];

//           const newArray = [...transferCreditResponseList, ...newIm];

//           setDisplayData(newArray);
//           setModalData({
//             founded: newFile.foundedDipCourseIdList,
//             notFounded: newFile.notFoundedDipCourseIdList,
//           });
//           onOpen();
//         }
//       } catch (error) {
//         console.error("Failed to upload file:", error);
//       }
//     }
//   };
  return (
    <>
      <Button
        label="อัพโหลดทรานสคริป"
        backgroundColor="#2E99FC"
        color="#FFFFFF"
        paddingY="14px"
        paddingX="79px"
        borderRadius="8px"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>อัพโหลดทรานสคริป</ModalHeader>
          <ModalBody>
            <Input
           
              type="file"
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding="4px"
            />
          </ModalBody>

          <ModalFooter
            display="flex"
            padding="24px"
            justifyContent="space-between"
            gap="16px"
          >
            <Button label="อัพโหลด" width="100%" />
            <Button label="ยกเลิก" width="100%" onClick={onClose} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


export default ImportButton