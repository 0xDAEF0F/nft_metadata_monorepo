import { useState } from 'react'
import { usePopper } from 'react-popper'

export function TableImageThumbnail({
  url,
  alt,
}: {
  url: string
  alt: string
}) {
  const [isHovering, setIsHovering] = useState(false)

  const [thumbnailEl, setThumbnailElem] = useState<HTMLImageElement | null>(
    null,
  )
  const [bigImageEl, setBigImageElem] = useState<HTMLImageElement | null>(null)

  const { styles, attributes } = usePopper(thumbnailEl, bigImageEl, {
    placement: 'right',
    modifiers: [{ name: 'offset', options: { offset: [53, 5] } }],
  })

  return (
    <>
      <img
        ref={setThumbnailElem}
        onMouseEnter={() => setIsHovering(true)}
        onMouseOut={() => setIsHovering(false)}
        className='w-10 rounded-lg'
        src={url}
        alt={alt}
      />
      {isHovering && (
        <img
          ref={setBigImageElem}
          className='max-h-36 rounded-md'
          src={url}
          alt={alt}
          style={styles.popper}
          {...attributes.popper}
        />
      )}
    </>
  )
}
