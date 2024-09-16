import { Input, InputProps } from "@chakra-ui/react"
import React from "react"

interface IProps extends InputProps {
  placeholder?: string
}
const TextField = ({ placeholder, value, onChange, ...rest }: IProps) => {
  return (
    <Input
      placeholder={placeholder}
      value={value} // ส่งต่อ value ที่รับมา
      onChange={onChange} // ส่งต่อ onChange ที่รับมา
      borderWidth="2px"
      borderColor="black"
    ></Input>
  )
}

export default TextField
