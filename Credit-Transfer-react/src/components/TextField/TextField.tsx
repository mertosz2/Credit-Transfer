import { Input, InputProps } from "@chakra-ui/react"
import React from "react"

interface IProps extends InputProps {
  placeholder?: string
}
const TextField = ({ placeholder, value, onChange, ...rest }: IProps) => {
  return (
    <Input
      type="password"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      borderWidth="2px"
      borderColor="black"
    ></Input>
  )
}

export default TextField
