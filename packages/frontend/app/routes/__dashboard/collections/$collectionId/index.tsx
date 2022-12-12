import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
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
    const updateResponse = await fetch(
      `${process.env.API_BASE_URL}/collection/edit/${params.collectionId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ name, description, externalUrl }),
      },
    )
    if (updateResponse.ok)
      return redirect(`/collections/${params.collectionId}`)

    const updateData = await updateResponse.json()
    return json(updateData)
  }
}

export default function Index() {
  const loaderData = useLoaderData<{ collection: Collection }>()

  return (
    <>
      <div className='center my-12 flex justify-center'>
        <EditCollection collection={loaderData.collection} />
      </div>
    </>
  )
}
