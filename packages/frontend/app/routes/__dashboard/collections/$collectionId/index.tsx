import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { extractJwt, fetchWithJwt } from '~/lib/helpers'
import type { LoaderFunction } from '@remix-run/node'
import type { Nft } from '@prisma/client'

export const loader: LoaderFunction = async ({ request, params }) => {
  const jwt = await extractJwt(request)
  if (!jwt) return redirect('/login')

  const res = await fetchWithJwt(`/nft/${params.collectionId}`, jwt)
  const data = await res.json()

  return json(data)
}

export default function Index() {
  const loaderData = useLoaderData<Nft[]>()

  return <div>Number of Nfts in collection: {loaderData.length}</div>
}
