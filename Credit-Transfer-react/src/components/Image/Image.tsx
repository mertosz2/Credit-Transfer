import React, { memo } from "react"
import Image, { ImageProps } from "next/image"

export interface ImageCustomProps extends ImageProps {
  srcWebp?: string
}

export const ImageCustom = ({
  src,
  width,
  height,
  alt,
  srcWebp,
  ...props
}: ImageCustomProps) => {
  const imgSrcWebp = srcWebp || ""

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={imgSrcWebp as string}
      />
      <Image
        src={src}
        width={width || 0}
        height={height || 0}
        alt={alt || "Picture"}
        loading="lazy"
        quality={100}
        {...props}
      />
    </picture>
  )
}

export default memo(ImageCustom)
