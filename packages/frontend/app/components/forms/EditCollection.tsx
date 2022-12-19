import type { Collection } from '@prisma/client'
import { useParams } from '@remix-run/react'

export function EditCollection({
  collection,
}: {
  collection: Omit<Collection, 'updatedAt' | 'createdAt'>
}) {
  const params = useParams()

  return (
    <form
      method='post'
      action={`/collections/${params.collectionId}?index`}
      className='block w-1/2 space-y-4 rounded-lg bg-white p-6 shadow-lg'>
      {/* Collection Name */}
      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700'>
          Collection Name
        </label>
        <div className='mt-1'>
          <input
            type='text'
            name='name'
            id='name'
            defaultValue={collection.name}
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            placeholder='CryptoPunks'
          />
        </div>
      </div>
      {/* Description */}
      <div>
        <label
          htmlFor='description'
          className='my-1 block text-sm font-medium text-gray-700'>
          Description
        </label>
        <textarea
          rows={3}
          name='description'
          id='description'
          className='block w-full rounded-md border border-gray-300 p-1 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          defaultValue={collection.description ? collection.description : ''}
        />
      </div>

      {/* Network */}
      <div>
        <label
          htmlFor='network'
          className='my-1 block text-sm font-medium text-gray-700'>
          Network
        </label>
        <select
          name='network'
          id='network'
          defaultValue={collection.network}
          className='rounded-lg text-sm'>
          <option value='MAINNET'>Mainnet</option>
          <option value='LOCALHOST'>Localhost</option>
        </select>
      </div>

      {/* External URL */}
      <div>
        <label
          htmlFor='company-website'
          className='block text-sm font-medium text-gray-700'>
          Collection Website
        </label>
        <div className='mt-1 flex rounded-md shadow-sm'>
          <span className='inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm'>
            http://
          </span>
          <input
            type='text'
            name='company-website'
            id='company-website'
            className='block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            defaultValue={collection.externalUrl ? collection.externalUrl : ''}
            placeholder='www.example.xyz'
          />
        </div>
      </div>

      {/* Action Group */}
      <div className='flex flex-row-reverse justify-between'>
        <div className='flex flex-row-reverse'>
          <button
            type='submit'
            name='intent'
            value='update'
            className='mx-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
            Save
          </button>
          <button
            type='submit'
            name='intent'
            value='reset'
            className='inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
            Reset
          </button>
        </div>
        <button
          type='submit'
          name='intent'
          value='delete'
          className='text-sm font-medium text-indigo-700'>
          Delete Collection
        </button>
      </div>
    </form>
  )
}
