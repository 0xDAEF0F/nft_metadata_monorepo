import { json, redirect } from '@remix-run/node'
import { extractJwt } from '~/lib/helpers'
import { useActionData, useParams, useLoaderData } from '@remix-run/react'
import { fetchWithJwt } from '~/lib/helpers'
import { formatEthAddress } from 'eth-address'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async ({ request, params }) => {
  const jwt = await extractJwt(request)
  if (!jwt) return redirect('/login')

  const res = await fetchWithJwt(`/whitelist/${params.collectionId}`, jwt)
  const data = await res.json()

  return json(data.inviteList)
}

export const action: ActionFunction = async ({ request, params }) => {
  const jwt = await extractJwt(request)
  if (!jwt) redirect('/login')

  const formData = await request.formData()
  const address = formData.get('address')

  const res = await fetch(
    process.env.API_BASE_URL + `/whitelist/invite-one/${params.collectionId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    },
  )

  const data = await res.json()
  return json(data)
}

export default function Whitelist() {
  const { collectionId } = useParams()
  const loaderData = useLoaderData<string[]>()
  const actionData = useActionData()

  return (
    <div className='m-8 w-1/2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm'>
      <form action={`/collections/${collectionId}/whitelist`} method='post'>
        <label
          className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
          htmlFor='address'>
          Invite Address
        </label>
        <div className='flex'>
          <input
            name='address'
            type='text'
            id='address'
            className='rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none'
          />
          <button
            className='items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            type='submit'>
            Add
          </button>
        </div>
        {loaderData &&
          loaderData.map((addr) => <p key={addr}>{formatEthAddress(addr)}</p>)}
      </form>
    </div>
  )
}
