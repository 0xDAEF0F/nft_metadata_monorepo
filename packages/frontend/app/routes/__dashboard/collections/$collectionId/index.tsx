import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData, useParams } from '@remix-run/react'
import { fetchWithJwt, requireJwt } from '~/lib/helpers'
import { EditCollection } from '~/components/forms/EditCollection'
import { Dialog, Transition } from '@headlessui/react'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import type { Collection } from '@prisma/client'
import { useState, Fragment } from 'react'
import cx from 'classnames'

export const loader: LoaderFunction = async ({ request, params }) => {
  const jwt = await requireJwt(request)

  const collectionResponse = await fetchWithJwt(
    `/collection/${params.collectionId}`,
    jwt,
  )

  if (!collectionResponse.ok) return redirect('/collections')

  const collectionData = await collectionResponse.json()

  return json({ collection: collectionData })
}

export const action: ActionFunction = async ({ request, params }) => {
  const jwt = await requireJwt(request)

  const formData = await request.formData()
  const intent = formData.get('intent')

  if (intent === 'reset') {
    return redirect(`/collections/${params.collectionId}`)
  }

  if (intent === 'delete') {
    const deleteResponse = await fetch(
      `${process.env.API_BASE_URL}/collection/delete/${params.collectionId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    )
    if (deleteResponse.ok) return redirect('/collections')

    const data = deleteResponse.json()
    return json(data)
  }

  if (intent === 'update') {
    const name = formData.get('name')
    const description = formData.get('description')
    const externalUrl = formData.get('company-website')
    const network = formData.get('network')
    const updateResponse = await fetch(
      `${process.env.API_BASE_URL}/collection/edit/${params.collectionId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ name, description, externalUrl, network }),
      },
    )
    if (updateResponse.ok)
      return redirect(`/collections/${params.collectionId}`)

    const updateData = await updateResponse.json()
    return json(updateData)
  }

  if (intent === 'deploy') {
    const username = formData.get('username')
    const password = formData.get('password')

    const deployResponse = await fetch(
      `${process.env.API_BASE_URL}/collection/deploy/${params.collectionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ username, password }),
      },
    )

    const deployData = await deployResponse.json()

    return json(deployData)
  }
}

export default function Index() {
  const params = useParams()
  const loaderData = useLoaderData<{ collection: Collection }>()
  const actionData = useActionData()
  const [openCredentialsModal, setOpenCredentialsModal] = useState(false)

  console.log({ actionData, loaderData })

  return (
    <>
      <div className='my-5 justify-center'>
        <div className='ml-5 flex'>
          <EditCollection collection={loaderData.collection} />
          {!loaderData.collection.contractAddress && (
            <div className='ml-5 h-fit w-1/3 rounded-lg bg-white p-6 shadow-sm'>
              <p className='block text-sm font-medium text-gray-700'>
                Deploy Collection
              </p>
              <button
                onClick={() => setOpenCredentialsModal(true)}
                className='mt-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                Deploy
              </button>
            </div>
          )}
        </div>
      </div>
      {/* MODAL TO DEPLOY */}
      <Transition.Root show={openCredentialsModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={setOpenCredentialsModal}>
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
                        Enter Credentials To Deploy
                      </Dialog.Title>
                      <form
                        method='post'
                        action={`/collections/${params.collectionId}?index`}
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
                            name='intent'
                            value='deploy'
                            type='submit'
                            onClick={() => setOpenCredentialsModal(false)}
                            className='inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-offset-2 sm:text-sm'>
                            Deploy
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
    </>
  )
}
