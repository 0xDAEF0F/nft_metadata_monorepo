import { useState } from 'react'
import { usePopper } from 'react-popper'

export function NftAttribute({
  trait_type,
  value,
}: {
  trait_type: string
  value: string
}) {
  const [isHovering, setIsHovering] = useState(false)

  const [pillEl, setPillEl] = useState<HTMLSpanElement | null>(null)
  const [tooltipEl, setTooltipEl] = useState<HTMLDivElement | null>(null)

  const { styles, attributes } = usePopper(pillEl, tooltipEl, {
    placement: 'top',
    modifiers: [{ name: 'offset', options: { offset: [0, 5] } }],
  })

  return (
    <>
      <span
        className='mx-1 whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-500'
        ref={setPillEl}
        onMouseEnter={() => setIsHovering(true)}
        onMouseOut={() => setIsHovering(false)}>
        {value}
      </span>

      {isHovering && (
        <div
          className='rounded-full border border-gray-200 bg-gray-50 px-2'
          ref={setTooltipEl}
          style={styles.popper}
          {...attributes.popper}>
          {trait_type}
        </div>
      )}
    </>
  )
}
