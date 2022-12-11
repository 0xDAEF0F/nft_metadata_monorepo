import { json, redirect } from '@remix-run/node'
import { extractJwt } from '~/lib/helpers'
import { useActionData, useParams } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/node'

export const action: ActionFunction = async ({ request, params }) => {
  const jwt = await extractJwt(request)
  if (!jwt) redirect('/login')

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
  if (res.ok) return redirect('/collections/' + params.collectionId)

  const data = await res.json()
  return json(data)
}

export default function BatchMetadata() {
  const { collectionId } = useParams()
  const actionData = useActionData()
  console.log({ actionData })

  return (
    <>
      <div>BatchMetadata</div>
      <form
        action={`/collections/${collectionId}/batch-metadata`}
        method='post'
        encType='multipart/form-data'>
        <input name='file' type='file' />
        <button
          className='m-1 block rounded-lg border border-black px-1'
          type='submit'>
          submit
        </button>
      </form>
    </>
  )
}
