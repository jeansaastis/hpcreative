// components/ImageBox.tsx
import Image from 'next/image'

export default function ImageBox({
  image,
  alt,
  classesWrapper = '',
  imageClassName = '',
}: {
  image?: string | {asset?: {url?: string}}
  alt?: string
  classesWrapper?: string
  imageClassName?: string
}) {
  const url = typeof image === 'string' ? image : image?.asset?.url

  if (!url) return null

  return (
    <div className={classesWrapper}>
      <Image src={url} alt={alt || ''} fill className={imageClassName || 'object-cover'} />
    </div>
  )
}
