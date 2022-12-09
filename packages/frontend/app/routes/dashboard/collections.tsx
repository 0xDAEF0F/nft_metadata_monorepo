import { TabsWithUnderline } from '~/components/tabs/TabsWithUnderline'
import { createCookie, json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { CollectionCard } from '~/components/cards/CollectionCard'
import { EmptyCollectionCard } from '~/components/cards/EmptyCollectionCard'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import type { Collection } from '@prisma/client'
import type { ZodIssue } from 'zod'

const tabs = [
  { name: 'Overview', to: '/dashboard', current: false },
  { name: 'Collections', to: '/dashboard/collections', current: true },
]

export const loader: LoaderFunction = async ({ request }) => {
  const jwt = await createCookie('jwt').parse(request.headers.get('Cookie'))

  if (!jwt) return redirect('/login')

  const res = await fetch(process.env.API_BASE_URL + '/collection/getMany', {
    headers: { Authorization: `Bearer ${jwt}` },
  })

  if (!res.ok) return redirect('/login')

  const data: Collection[] = await res.json()

  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const jwt = await createCookie('jwt').parse(request.headers.get('Cookie'))
  const name = form.get('name')

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

export default function Collections() {
  const loaderData = useLoaderData<Collection[]>()
  return (
    <div className='ml-16'>
      <TabsWithUnderline tabs={tabs} />
      <div className='mx-auto max-w-7xl py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='h-96 rounded-lg border-4 border-dashed border-gray-200'>
            {loaderData.map((item) => (
              <CollectionCard key={item.id} name={item.name} />
            ))}
            <EmptyCollectionCard />
          </div>
        </div>
      </div>
    </div>
  )
}
