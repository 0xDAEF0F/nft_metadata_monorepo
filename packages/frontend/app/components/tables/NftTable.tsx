import { NftAttribute } from '../popovers/NftAttribute'
import { TableImageThumbnail } from '../popovers/NftImage'
import type { Nft as NftPrisma } from '@prisma/client'

type Nft = NftPrisma & {
  attributes:
    | {
        trait_type: string
        value: string
      }[]
    | null
  createdAt: string
  updatedAt: string
}

export function NftTable({ nfts }: { nfts: Nft[] }) {
  return (
    <div className='px-6'>
      <div className='mt-8 flex flex-col'>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'>
                      Image
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Token Id
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Attributes
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {nfts.map((nft) => {
                    return (
                      <tr key={nft.tokenId}>
                        <td className='whitespace-nowrap p-2 text-sm font-medium text-gray-900 sm:pl-6'>
                          <TableImageThumbnail
                            url={nft.image || ''}
                            alt={'alt'}
                          />
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                          {nft.tokenId}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                          {nft.attributes?.map((attr, idx) => {
                            return (
                              <NftAttribute
                                key={idx}
                                trait_type={attr.trait_type}
                                value={attr.value}
                              />
                            )
                          })}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                          {nft.amount}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
