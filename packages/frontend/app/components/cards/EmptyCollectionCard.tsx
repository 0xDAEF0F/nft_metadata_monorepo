import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useActionData } from '@remix-run/react'
import cx from 'classnames'

type ActionData = {
  formError?: string
  fieldError?: {
    name?: string[]
  }
}

export function EmptyCollectionCard() {
  const actionData = useActionData<ActionData>()
  const [open, setOpen] = useState(
    actionData?.formError || actionData?.fieldError ? true : false,
  )

  const nameErrors = actionData?.fieldError?.name?.map((msg, idx) => {
    return (
      <li className='list-disc text-xs text-red-600' key={idx}>
        {msg}
      </li>
    )
  })

  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
                  <div>
                    <div className='mt-3 text-center sm:mt-5'>
                      <Dialog.Title
                        as='h3'
                        className='text-lg font-medium leading-6 text-gray-900'>
                        Give your collection a name
                      </Dialog.Title>
                      <form
                        method='post'
                        action='/collections?index'
                        className='mt-2'>
                        <div className='text-left'>
                          <label
                            htmlFor='name'
                            className='block text-sm font-medium text-gray-700'>
                            Name:
                          </label>
                          <div className='mt-1'>
                            <input
                              type='name'
                              name='name'
                              id='name'
                              className={cx(
                                (actionData && actionData?.fieldError?.name) ||
                                  actionData?.formError
                                  ? 'border border-red-600 focus:border-red-500 focus:ring-red-500'
                                  : 'border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                                'block w-full rounded-md p-1 shadow-sm sm:text-sm',
                              )}
                              placeholder='CryptoPunks'
                            />
                            {nameErrors && (
                              <ul className='mt-1 ml-4'>{nameErrors}</ul>
                            )}
                            {actionData?.formError && (
                              <div className='mt-1'>
                                <div className='text-xs text-red-600'>
                                  {actionData?.formError}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='mt-5'>
                          <button
                            type='submit'
                            className='inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm'>
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <button
        type='button'
        onClick={() => setOpen(true)}
        className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
        + Create Collection
      </button>
    </div>
  )
}
