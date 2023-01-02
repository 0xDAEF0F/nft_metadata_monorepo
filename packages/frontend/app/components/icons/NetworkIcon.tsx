import type { Network } from '@prisma/client'
import { ShieldExclamationIcon } from '@heroicons/react/20/solid'
import { match } from 'ts-pattern'
import { Tooltip } from 'flowbite-react'
import { head } from 'lodash'

// TODO: Fix the functionality of the arrow behavior (it is not working for some reason)
// flowbite is not applying the styles properly
export function NetworkIcon({ name }: { name: Network }) {
  const imgSrc = match(name)
    .with('MAINNET', () => '/networks/mainnet.png')
    .with('ARBITRUM', () => '/networks/arbitrum.png')
    .with('POLYGON', () => '/networks/matic.png')
    .with('OPTIMISM', () => '/networks/optimism.png')
    .otherwise(() => '')

  const formattedName = head(name) + name.slice(1).toLowerCase()

  return (
    <Tooltip arrow={false} content={formattedName}>
      {name === 'LOCALHOST' || name === 'GOERLI' ? (
        <ShieldExclamationIcon width={20} />
      ) : (
        <img src={imgSrc} alt={name} className='h-5 w-5' />
      )}
    </Tooltip>
  )
}
