import { json, redirect } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { EmptyCollectionCard } from '~/components/cards/EmptyCollectionCard'
import { extractJwt, fetchWithJwt } from '~/lib/helpers'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import type { Collection } from '@prisma/client'
import type { ZodIssue } from 'zod'

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const name = form.get('name')
  const jwt = await extractJwt(request)

  if (!name) return json({ formError: 'Name is required' }, { status: 400 })
  if (!jwt) return redirect('/login')

  const res = await fetch(process.env.API_BASE_URL + '/collection/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ name }),
  })

  if (res.ok) redirect('/dashboard')

  const data = await res.json()
  const zodErrors = data.errors as ZodIssue[]

  if (zodErrors) {
    const nameError = zodErrors
      .filter((issue) => issue.path[0] === 'name')
      .map((i) => i.message)

    return json({
      fieldError: {
        name: nameError,
      },
    })
  }

  return json({ formError: data.message })
}

export const loader: LoaderFunction = async ({ request }) => {
  const jwt = await extractJwt(request)
  if (!jwt) return redirect('/login')

  const res = await fetchWithJwt('/collection/getMany', jwt)

  if (!res.ok) return redirect('/login')

  const data: Collection[] = await res.json()

  return json(data)
}

export default function Collections() {
  const loaderData = useLoaderData<Collection[]>()
  return (
    <>
      <EmptyCollectionCard />
      <div className='m-10 grid grid-cols-3 rounded-lg border-4 border-dashed border-gray-200 p-4'>
        {loaderData.map((item) => (
          <Link key={item.id} to={'' + item.id}>
            <div className='m-3 rounded-lg border border-gray-200 bg-white p-6 shadow-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'>
              <div>
                <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
                  {item.name}
                </h5>
                <p className='font-normal text-gray-700 dark:text-gray-400'>
                  ERC-1155
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
