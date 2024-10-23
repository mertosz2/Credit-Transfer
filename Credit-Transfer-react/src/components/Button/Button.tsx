import { Button as ButtonCk, ButtonProps } from "@chakra-ui/react"
import { JSXElementConstructor, ReactElement } from "react"
interface IProps extends ButtonProps {
  label: string | ReactElement<any, string | JSXElementConstructor<any>>
  leftIcon?: ReactElement<any, string | JSXElementConstructor<any>>
  rightIcon?: ReactElement<any, string | JSXElementConstructor<any>>
  onClick?: () => void
}
const Button = ({ label, onClick, leftIcon, rightIcon, ...props }: IProps) => {
  return (
    <ButtonCk
      bgColor={props.bgColor}
      textColor={props.textColor}
      borderColor={props.borderColor}
      borderWidth={props.borderWidth}
      justifyContent={props.justifyContent || "center"}
      alignItems={props.alignItems || "center"}
      boxShadow={props.shadow}
      borderRadius={props.borderRadius || "full"}
      fontSize={props.fontSize || 14}
      height={props.height || "40px"}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      paddingX={props.paddingX || "14px"}
      paddingY={props.paddingY}
      onClick={onClick}
      _hover={props._hover || {}}
      {...props}
    >
      {label}
    </ButtonCk>
  )
}

export default Button
