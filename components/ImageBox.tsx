import {urlForImage} from '@/sanity/lib/utils'
import Image from 'next/image'

interface ImageBoxProps {
  'image'?: {asset?: any}
  'alt'?: string
  'width'?: number
  'height'?: number
  'size'?: string
  'classesWrapper'?: string
  'imageClassName'?: string // ✅ added
  'data-sanity'?: string
}

export default function ImageBox({
  image,
  alt = 'Cover image',
  width = 3500,
  height = 2000,
  size = '100vw',
  classesWrapper,
  imageClassName = 'absolute h-full w-full', // ✅ default value
  ...props
}: ImageBoxProps) {
  const imageUrl = image && urlForImage(image)?.height(height).width(width).fit('crop').url()

  return (
    <div
      className={`w-full overflow-hidden rounded-[3px] bg-gray-50 ${classesWrapper || ''}`}
      data-sanity={props['data-sanity']}
    >
      {imageUrl && (
        <Image
          className={imageClassName} // ✅ now uses prop
          alt={alt}
          width={width}
          height={height}
          sizes={size}
          src={imageUrl}
        />
      )}
    </div>
  )
}
