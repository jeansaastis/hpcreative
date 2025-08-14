import Image from 'next/image'
import {CustomPortableText} from './CustomPortableText'

export default function CvSection({content, image}: {content: any[]; image?: {url: string}}) {
  return (
    <section className="w-full bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-8">
        {/* Text */}
        <div className="w-full md:w-1/2 prose prose-lg md:prose-xl prose-headings:font-bold prose-headings:mb-4 prose-p:mb-6 max-w-none">
          {content && <CustomPortableText id={null} type={null} path={[]} value={content} />}
        </div>

        {/* Image */}
        {image && (
          <div className="w-full md:w-1/2 relative aspect-[16/9] md:aspect-auto md:h-[500px]">
            <Image
              src={image.url}
              alt="CV Illustration"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}
      </div>
    </section>
  )
}
