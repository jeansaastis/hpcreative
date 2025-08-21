import {LinkedInIcon} from '@/components/icons/LinkedIn'

export default function BlogEmptyPanel({
  heading = '',
  sub = '',
  linkedinUrl,
}: {
  heading?: string
  sub?: string
  linkedinUrl?: string
}) {
  return (
    <div className="p-0 sm:p-0">
      {/* Heading — same “feel” as earlier (display, bold, blue) */}
      <h3 className="font-display text-blue font-bold mb-2 text-4xl">{heading}</h3>

      {/* Subcopy */}
      <p className="text-[#11171C] text-base md:text-2xl">{sub}</p>

      {/* Contacts */}
      <div className="mt-5 space-y-3 text-[#11171C]">
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 mt-2 rounded-full border-2 border-[#11171C] inline-flex items-center gap-2 hover:bg-black/100 hover:text-white"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className=" h-4 w-4 md:h-7 md:w-7" />
            <span className="text-sm md:text-lg">Löydät minut myös LinkedIn-palvelusta</span>
          </a>
        )}
      </div>
    </div>
  )
}
