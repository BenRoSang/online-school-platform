interface CourseThumbnailProps {
  src: string | null
  title: string
  className?: string
}

export function CourseThumbnail({ src, title, className = '' }: CourseThumbnailProps) {
  if (src) {
    return <img src={src} alt="" className={`object-cover ${className}`} />
  }

  return (
    <div
      className={`grid place-items-center bg-gradient-to-br from-brand-500 to-slate-900 ${className}`}
      role="img"
      aria-label={`${title} course placeholder`}
    >
      <svg viewBox="0 0 24 24" className="size-14 text-white/90" fill="none" aria-hidden="true">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" stroke="currentColor" strokeWidth="1.7" />
        <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20M8 7h8M8 10h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </div>
  )
}
