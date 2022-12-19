import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData, useParams } from '@remix-run/react'
import { extractJwt, fetchWithJwt } from '~/lib/helpers'
import { EditCollection } from '~/components/forms/EditCollection'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import type { Collection } from '@prisma/client'

export const loader: LoaderFunction = async ({ request, params }) => {
  const jwt = await extractJwt(request)
  if (!jwt) return redirect('/login')

  const collectionResponse = await fetchWithJwt(
    `/collection/${params.collectionId}`,
    jwt,
  )
  const collectionData = await collectionResponse.json()

  return json({ collection: collectionData })
}

export const action: ActionFunction = async ({ request, params }) => {
  const jwt = await extractJwt(request)
  if (!jwt) return redirect('/login')

  const formData = await request.formData()
  const intent = formData.get('intent')

  if (intent === 'reset') {
    return redirect(`/collections/${params.collectionId}`)
  }

  if (intent === 'delete') {
    const deleteResponse = await fetch(
      `${process.env.API_BASE_URL}/collection/delete/${params.collectionId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    )
    if (deleteResponse.ok) return redirect('/collections')

    const data = deleteResponse.json()
    return json(data)
  }

  if (intent === 'update') {
    const name = formData.get('name')
    const description = formData.get('description')
    const externalUrl = formData.get('company-website')
    const network = formData.get('network')
    const updateResponse = await fetch(
      `${process.env.API_BASE_URL}/collection/edit/${params.collectionId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ name, description, externalUrl, network }),
      },
    )
    if (updateResponse.ok)
      return redirect(`/collections/${params.collectionId}`)

    const updateData = await updateResponse.json()
    return json(updateData)
  }

  if (intent === 'deploy') {
    return json('going to deploy')
  }
}

export default function Index() {
  const params = useParams()
  const loaderData = useLoaderData<{ collection: Collection }>()
  const actionData = useActionData()

  console.log({ actionData })

  return (
    <>
      <div className='my-5 justify-center'>
        <div className='ml-5 flex'>
          <EditCollection collection={loaderData.collection} />
          {!loaderData.collection.deployed && (
            <div className='ml-5 h-fit w-1/3 rounded-lg bg-white p-6 shadow-sm'>
              <p className='block text-sm font-medium text-gray-700'>
                Deploy Collection
              </p>
              <form
                method='POST'
                action={`/collections/${params.collectionId}?index`}>
                <button
                  className='mt-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  type='submit'
                  name='intent'
                  value='deploy'>
                  Deploy
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
