import { createCookie, json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async ({ request }) => {
  const jwt = await createCookie('jwt').parse(request.headers.get('Cookie'))

  if (!jwt) return redirect('/login')

  const res = await fetch(process.env.API_BASE_URL + '/auth/whoami', {
    headers: { Authorization: `Bearer ${jwt}` },
  })

  if (!res.ok) return redirect('/login')

  const data = (await res.json()) as { id: number; username: string }

  return json({ username: data.username })
}

export default function Dashboard() {
  const loaderData = useLoaderData<{ username: string }>()
  const username = loaderData.username

  return <div>welcome {username}</div>
}
