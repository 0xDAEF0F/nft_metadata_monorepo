import { json, redirect } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { EmptyCollectionCard } from '~/components/cards/EmptyCollectionCard'
import { fetchWithJwt, requireJwt } from '~/lib/helpers'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import type { Collection } from '@prisma/client'
import type { ZodIssue } from 'zod'

export const action: ActionFunction = async ({ request }) => {
  const jwt = await requireJwt(request)
  const form = await request.formData()
  const name = form.get('name')

  if (!name) return json({ formError: 'Name is required' }, { status: 400 })

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
  const jwt = await requireJwt(request)

  const res = await fetchWithJwt('/collection/getMany', jwt)

  if (!res.ok) return redirect('/login')

  const data: Collection[] = await res.json()

  return json(data)
}

export default function Collections() {
  const loaderData = useLoaderData<Collection[]>()
  console.log(loaderData)
  return (
    <div className='mx-auto mt-10 max-w-7xl p-6'>
      <div className='mb-2 flex items-center justify-between border-b pb-2'>
        <div className='ml-3'>
          <p className='text-3xl font-bold'>Collections</p>
        </div>
        <div className='mr-3'>
          {loaderData.length > 0 && <EmptyCollectionCard />}
        </div>
      </div>

      <div className='mx-auto grid grid-cols-2 md:grid-cols-3'>
        {loaderData.map((item) => (
          <Link key={item.id} to={'' + item.id}>
            <div className='m-3 rounded-lg border border-gray-200 bg-white p-6 shadow-md hover:bg-gray-100'>
              <h5 className='mb-2 text-xl font-bold tracking-tight text-gray-900'>
                {item.name}
              </h5>

              <p className='font-normal text-gray-700 dark:text-gray-400'>
                {item.standard}
              </p>
              <p className='text-xs lowercase'>{item.network}</p>
              {item.contractAddress && (
                <p className='mt-1 text-xs uppercase'>deployed</p>
              )}
            </div>
          </Link>
        ))}
      </div>
      {loaderData.length === 0 && (
        <div className='rounded-lg border-4 border-dashed border-gray-200 py-3 text-center'>
          <svg
            className='mx-auto h-12 w-12 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            aria-hidden='true'>
            <path
              vectorEffect='non-scaling-stroke'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
            />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>
            No collections
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            Get started by creating a new one.
          </p>
          <div className='mt-6'>
            <EmptyCollectionCard />
          </div>
        </div>
      )}
    </div>
  )
}
