import { json, redirect } from '@remix-run/node'
import { requireJwt } from '~/lib/helpers'
import { useLoaderData, useSubmit, Form } from '@remix-run/react'
import { fetchWithJwt } from '~/lib/helpers'
import { NftTable } from '~/components/tables/NftTable'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async ({ request, params }) => {
  const jwt = await requireJwt(request)

  const res = await fetchWithJwt(`/nft/${params.collectionId}`, jwt)
  const data = await res.json()

  return json({ nfts: data })
}

export const action: ActionFunction = async ({ request, params }) => {
  const collectionId = params.collectionId
  const jwt = await requireJwt(request)
  const clonedRequest = request.clone()
  const intent = (await clonedRequest.formData()).get('intent')

  // ATTRIBUTE UPLOADING
  if (intent === 'csv') {
    const res = await fetch(
      process.env.API_BASE_URL + `/attributes/batch/${collectionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': request.headers.get('content-type') as string,
          Authorization: `Bearer ${jwt}`,
        },
        body: request.body,
      },
    )
    if (res.ok) return redirect(`/collections/${collectionId}`)

    return json(await res.json())
  }

  // IMAGE UPLOADING
  const res = await fetch(
    process.env.API_BASE_URL + `/image/batch/${collectionId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') as string,
        Authorization: `Bearer ${jwt}`,
      },
      body: request.body,
    },
  )

  if (res.ok) redirect(`/collections/${collectionId}`)

  return json(await res.json())
}

export default function BatchMetadata() {
  const loaderData = useLoaderData()
  const submit = useSubmit()

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    submit(event.currentTarget, { replace: true })
  }

  return (
    <div className='mx-auto mt-5 max-w-4xl flex-col'>
      <h1 className='text-3xl font-bold text-gray-900'>Metadata</h1>
      <div className='mt-4 rounded-lg border border-gray-200 bg-white pt-9'>
        <div className='mx-auto w-full max-w-3xl'>
          <div className='mb-20 grid grid-cols-1 gap-y-5 md:grid-cols-2'>
            <div className='w-64'>
              <label className='block text-sm font-semibold text-gray-900 dark:text-white'>
                Upload Your Collection Images
              </label>
              <label className='mb-2 block text-xs font-normal text-gray-500'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit sed do
                eiusmod tempor.
              </label>
            </div>
            <div className='w-full'>
              <Form
                method='post'
                encType='multipart/form-data'
                onChange={handleChange}>
                <label className='flex w-full items-center justify-center'>
                  <div className='mb-4 flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'>
                    <div className='flex flex-col items-center justify-center'>
                      <svg
                        className='mx-auto h-10 w-10 text-gray-400'
                        stroke='currentColor'
                        fill='none'
                        viewBox='0 0 48 48'
                        aria-hidden='true'>
                        <path
                          d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </div>
                    <div className='flex text-xs'>
                      <p className='font-medium text-purple-500'>
                        Upload a file
                      </p>
                      <p className='pl-1 text-gray-500'>or drag and drop</p>
                    </div>
                    <input
                      multiple
                      className='hidden'
                      name='file'
                      type='file'
                      id='img'
                    />
                  </div>
                </label>
              </Form>
            </div>
            <div className='w-64'>
              <label className='block text-sm font-semibold text-gray-900 dark:text-white'>
                Upload Your Attributes File (CSV)
              </label>
              <label className='mb-2 block text-xs font-normal text-gray-500'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit sed do
                eiusmod tempor.
              </label>
            </div>
            <div className='w-full'>
              <Form
                method='post'
                encType='multipart/form-data'
                onChange={handleChange}>
                <label className='flex w-full items-center justify-center'>
                  <div className='flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'>
                    <div className='flex flex-col items-center justify-center pb-1'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        className='h-8 w-8 text-gray-400'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
                        />
                      </svg>
                    </div>
                    <div className='flex text-xs'>
                      <p className='font-medium text-purple-500'>
                        Upload a file
                      </p>
                      <p className='pl-1 text-gray-500'>or drag and drop</p>
                    </div>

                    <input
                      multiple
                      className='hidden'
                      name='file'
                      type='file'
                      id='csv'
                    />

                    <input type='hidden' name='intent' value='csv' />
                  </div>
                </label>
              </Form>
            </div>
          </div>
          <div className='mb-10'>
            {loaderData.nfts.length > 0 && <NftTable nfts={loaderData.nfts} />}
          </div>
        </div>
      </div>
    </div>
  )
}
