import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, useActionData } from '@remix-run/react'
import { extractJwt, fetchWithJwt } from '~/lib/helpers'
import { formatEthAddress } from 'eth-address'
import cx from 'classnames'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import type { User } from '@prisma/client'

export const loader: LoaderFunction = async ({ request }) => {
  const jwt = await extractJwt(request)
  if (!jwt) return redirect('/login')

  const res = await fetchWithJwt('/auth/whoami', jwt)
  if (!res.ok) return redirect('/login')

  const data = await res.json()
  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const username = form.get('username')
  const password = form.get('password')
  const jwt = await extractJwt(request)

  if (!username || !password) return json({ formError: 'Missing fields' })
  if (!jwt) return redirect('/login')

  const res = await fetch(process.env.API_BASE_URL + '/auth/eject-pk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()

  if (data.message) return json({ formError: data.message })

  return json(data)
}

type ActionData = { privateKey?: string; formError?: string }

function Index() {
  const loaderData =
    useLoaderData<Pick<User, 'id' | 'username' | 'publicAddress'>>()
  const actionData = useActionData<ActionData>()
  const [open, setOpen] = useState(
    actionData && actionData?.formError ? true : false,
  )

  return (
    <div className='ml-16'>
      <div className='mx-auto max-w-7xl py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <h2 className='text-lg font-semibold'>Account information</h2>
          <ul>
            <li>Username: {loaderData.username}</li>
            <li>Balance</li>
            <li>
              Public address: {formatEthAddress(loaderData.publicAddress)}
            </li>
          </ul>
          <p className='inline'>Retrieve Private Key:</p>
          <button
            onClick={() => setOpen(true)}
            className='ml-2 rounded-lg border border-black p-1'>
            Click Me
          </button>
          {actionData && actionData.privateKey && (
            <p>Private Key: {actionData.privateKey}</p>
          )}
        </div>
      </div>
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
                        Provide Your Credentials
                      </Dialog.Title>
                      <form
                        method='post'
                        action='/dashboard?index'
                        className='mt-2'>
                        <div>
                          <label
                            htmlFor='username'
                            className='block text-sm font-medium text-gray-700'>
                            Username:
                          </label>
                          <div className='mt-1'>
                            <input
                              type='text'
                              name='username'
                              id='username'
                              className={cx(
                                'border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                                'block w-full rounded-md p-1 shadow-sm sm:text-sm',
                              )}
                              placeholder='JohnDoe'
                            />
                          </div>
                        </div>
                        <div className='mt-1'>
                          <label
                            htmlFor='password'
                            className='block text-sm font-medium text-gray-700'>
                            Password:
                          </label>
                          <div className='mt-1'>
                            <input
                              type='password'
                              name='password'
                              id='password'
                              className={cx(
                                'border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                                'block w-full rounded-md p-1 shadow-sm sm:text-sm',
                              )}
                              placeholder='**********'
                            />
                          </div>
                        </div>
                        <div className='mt-5 sm:mt-6'>
                          <button
                            onClick={() => setOpen(false)}
                            className='inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm'>
                            Retrieve
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
    </div>
  )
}

export default Index
