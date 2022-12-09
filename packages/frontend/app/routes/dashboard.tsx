import { createCookie, json, redirect } from '@remix-run/node'
import { useLoaderData, Outlet } from '@remix-run/react'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import type { Collection } from '@prisma/client'
import type { ZodIssue } from 'zod'
import { DashboardSidebar } from '~/components/sidebar/DashboardSidebar'

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

export const action: ActionFunction = async () => {
  return redirect('/login', {
    headers: {
      'Set-Cookie': await createCookie('jwt', {
        expires: new Date(Date.now() - 1000),
      }).serialize(''),
    },
  })
}

export default function Dashboard() {
  const loaderData = useLoaderData<Collection[]>()

  return (
    <>
      <div className='min-h-full'>
        <DashboardSidebar />
        <Outlet />
      </div>
    </>
  )
}
