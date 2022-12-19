import { json } from '@remix-run/node'
import { requireJwt } from '~/lib/helpers'
import { useActionData, useParams, useLoaderData } from '@remix-run/react'
import { fetchWithJwt } from '~/lib/helpers'
import { NftTable } from '~/components/tables/NftTable'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async ({ request, params }) => {
  const jwt = await requireJwt(request)

  const res = await fetchWithJwt(`/nft/${params.collectionId}`, jwt)
  const data = await res.json()

  return json({ nfts: data })
}

export const action: ActionFunction = async ({ request, params }) => {
  const jwt = await requireJwt(request)

  const res = await fetch(
    process.env.API_BASE_URL + `/attributes/batch/${params.collectionId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') as string,
        Authorization: `Bearer ${jwt}`,
      },
      body: request.body,
    },
  )

  const data = await res.json()
  return json(data)
}

export default function BatchMetadata() {
  const { collectionId } = useParams()
  const loaderData = useLoaderData()
  const actionData = useActionData()
  console.log({ actionData })

  return (
    <>
      <div className='m-8 w-1/2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm'>
        <form
          action={`/collections/${collectionId}/batch-metadata`}
          method='post'
          encType='multipart/form-data'>
          <label
            className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
            htmlFor='file_input'>
            Upload Your Attributes File (CSV)
          </label>
          <input
            name='file'
            type='file'
            id='file_input'
            className='mb-4 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none'
          />
          <button
            className='items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            type='submit'>
            Submit
          </button>
        </form>
      </div>
      {loaderData.nfts.length > 0 && <NftTable nfts={loaderData.nfts} />}
    </>
  )
}
