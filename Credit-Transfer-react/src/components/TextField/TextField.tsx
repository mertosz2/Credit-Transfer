import { Input, InputProps } from "@chakra-ui/react";
import React from "react";

interface IProps extends InputProps {
  placeholder?: string;
}
const TextField = ({ placeholder }: IProps) => {
  return (
    <Input
      placeholder={placeholder}
      borderWidth="2px"
      borderColor="black"
    ></Input>
  );
};

export default TextField;
