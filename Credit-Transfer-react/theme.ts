import { extendTheme } from "@chakra-ui/react"
import "@fontsource/kanit/400.css" // น้ำหนักปกติ
import "@fontsource/kanit/300.css" // น้ำหนักบาง
const theme = extendTheme({
  breakpoints: {
    sm: "30em", // 480px
    md: "48em", // 768px
    lg: "64em", // 1024px
    xl: "80em", // 1280px
    xxl: "1536px",
    xxxl: "1800px"
  }
})
export default theme
