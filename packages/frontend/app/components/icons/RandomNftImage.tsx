import { take, head, words } from 'lodash'

export function RandomNftImage({
  uri,
  nftId,
  collectionName,
}: {
  uri: string | null
  collectionName: string
  nftId: number
}) {
  if (!uri) {
    return (
      <span className='inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-500'>
        <span className='text-sm font-medium leading-none text-white'>
          {take(words(collectionName), 2).map(head).join('').toUpperCase()}
        </span>
      </span>
    )
  }
  return (
    <img
      className='inline-block h-8 w-8 rounded-md'
      src={uri}
      alt={nftId.toString()}
    />
  )
}
