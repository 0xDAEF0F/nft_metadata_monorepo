export function EditCollection() {
  return (
    <div className='block w-3/4 space-y-4 rounded-lg bg-white p-6 shadow-lg'>
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
          defaultValue={''}
        />
      </div>

      {/* File Upload */}
      <div>
        <label
          htmlFor='cover-photo'
          className='my-2 block text-sm font-medium text-gray-700'>
          Cover photo
        </label>
        <div className='flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6'>
          <div className='space-y-1 text-center'>
            {/* maybe replace svg with a prweview if there is a photo */}
            <svg
              className='mx-auto h-12 w-12 text-gray-400'
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
            <div className='flex text-sm text-gray-600'>
              <label
                htmlFor='file-upload'
                className='relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500'>
                <span>Upload a file</span>
                <input
                  id='file-upload'
                  name='file-upload'
                  type='file'
                  className='sr-only'
                />
              </label>
              <p className='pl-1'>or drag and drop</p>
            </div>
            <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
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
            placeholder='www.example.xyz'
          />
        </div>
      </div>

      {/* Action Group */}
      <div className='flex justify-between'>
        <button type='button' className='text-sm font-medium text-indigo-700'>
          Delete Collection
        </button>
        <div className='space-x-2'>
          <button
            type='button'
            className='inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
            Reset
          </button>
          <button
            type='button'
            className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
