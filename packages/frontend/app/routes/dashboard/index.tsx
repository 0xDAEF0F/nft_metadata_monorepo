import { TabsWithUnderline } from '~/components/tabs/TabsWithUnderline'
import { createCookie, json, redirect } from '@remix-run/node'
import { useLoaderData, Outlet } from '@remix-run/react'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import type { Collection } from '@prisma/client'
import type { ZodIssue } from 'zod'
import { DashboardSidebar } from '~/components/sidebar/DashboardSidebar'

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

const tabs = [
  { name: 'Overview', to: '/dashboard', current: true },
  { name: 'Collections', to: '/dashboard/collections', current: false },
]

function Index() {
  const loaderData = useLoaderData()
  return (
    <div className='ml-16'>
      <TabsWithUnderline tabs={tabs} />
      <div className='mx-auto max-w-7xl py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          Here goes some details about your account
          <ul>
            <li>balance</li>
            <li>public address</li>
            <li>a way to get your private key</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Index
