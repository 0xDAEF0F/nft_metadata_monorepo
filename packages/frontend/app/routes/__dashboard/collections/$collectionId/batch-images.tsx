import { json } from '@remix-run/node'
import { requireJwt } from '~/lib/helpers'
import type { BadRequestException } from '~/lib/helpers'
import { useActionData, useParams } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/node'

export const action: ActionFunction = async ({ request, params }) => {
  const jwt = await requireJwt(request)

  const res = await fetch(
    process.env.API_BASE_URL + `/image/batch/${params.collectionId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') as string,
        Authorization: `Bearer ${jwt}`,
      },
      body: request.body,
    },
  )
  const data = await res.json()
  return json(data)
}

export default function BatchImages() {
  const { collectionId } = useParams()
  const actionData = useActionData()

  return (
    <>
      <div className='m-8  max-w-sm rounded-lg border border-gray-200 bg-white p-3 shadow-sm'>
        <form
          action={`/collections/${collectionId}/batch-images`}
          method='post'
          encType='multipart/form-data'>
          <label className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
            Upload Your Collection Images
          </label>

          <div className='flex w-full items-center justify-center'>
            <label
              htmlFor='file_input'
              className='mb-4 flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'>
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <svg
                  aria-hidden='true'
                  className='mb-3 h-10 w-10 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'></path>
                </svg>
                <p className='mb-2 text-sm text-gray-500'>
                  <span className='font-semibold'>Click to upload</span>
                </p>
                <p className='mb-2 text-xs text-gray-500'>
                  SVG, PNG, JPG or GIF
                </p>
                <p className='text-xs font-semibold text-indigo-500'>
                  Image name needs to be its index
                </p>
                <p className='text-xs text-gray-500'>e.g. 1.jpg</p>
              </div>
              <input
                multiple
                className='hidden'
                name='file'
                type='file'
                id='file_input'
              />
            </label>
          </div>

          <div className='flex justify-between'>
            <button
              className='items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              type='submit'>
              Submit
            </button>
            {actionData && (
              <p className='text-sm text-red-500'>{actionData.message}</p>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
