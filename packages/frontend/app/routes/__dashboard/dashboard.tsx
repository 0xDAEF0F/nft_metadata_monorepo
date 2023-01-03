import { Fragment, useState } from 'react'
import cx from 'classnames'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, useActionData } from '@remix-run/react'
import { fetchWithJwt, requireJwt } from '~/lib/helpers'
import { formatEthAddress } from 'eth-address'
import { Tooltip } from 'flowbite-react'
import { Notification } from '~/components/popovers/Notification'
import Blockies from 'react-blockies'
import { EjectPrivateKey } from '~/components/modals/EjectPrivateKey'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import type { Network, User } from '@prisma/client'
import { WalletIcon } from '@heroicons/react/24/outline'
import { NetworkIcon } from '~/components/icons/NetworkIcon'
import { Dialog, Transition } from '@headlessui/react'

export const loader: LoaderFunction = async ({ request }) => {
  const jwt = await requireJwt(request)

  const res = await fetchWithJwt('/auth/whoami', jwt)
  if (!res.ok) return redirect('/login')
  const data = await res.json()
  const res2 = await fetchWithJwt(`/balance/${data.publicAddress}`, jwt)
  const balances = await res2.json()

  return json({ data, balances })
}

export const action: ActionFunction = async ({ request }) => {
  const jwt = await requireJwt(request)
  const form = await request.formData()
  const username = form.get('username')
  const password = form.get('password')

  if (!username || !password) return json({ formError: 'Missing fields' })

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
  const { data, balances } = useLoaderData<{
    data: Pick<User, 'id' | 'username' | 'publicAddress'>
    balances: Record<Network, { formatted: string; symbol: string }>
  }>()

  const actionData = useActionData<ActionData>()
  const [showBalance, setShowBalance] = useState(false)

  const [open, setOpen] = useState<boolean>(actionData ? true : false)
  const [showSuccessCopyAddress, setShowSuccessCopyAddress] = useState(false)

  const clearCopyNotification = () => {
    setTimeout(() => setShowSuccessCopyAddress(false), 3000)
  }

  const calculateStep = () => {
    if (!actionData) return 'A'
    if (actionData.formError) return 'A'
    if (actionData.privateKey) return 'B'
    return 'A'
  }

  return (
    <div className='ml-16'>
      <Notification
        show={showSuccessCopyAddress}
        setShow={setShowSuccessCopyAddress}
        data={{
          type: 'success',
          header: 'Success!',
          description: `address ${formatEthAddress(
            data.publicAddress,
          )} copied to clipboard`,
        }}
      />
      <div className='mx-auto mt-10 max-w-7xl p-6'>
        {/* TODO: This blockie is giving a warning (componentWillUpdate) */}
        <Blockies
          size={10}
          scale={10}
          seed={data.publicAddress}
          className='rounded-lg bg-white p-1 shadow-sm'
        />

        <div className='mt-3 flex items-center'>
          <p className='text-3xl font-semibold'>{data.username}</p>
          <Tooltip arrow={false} content='Balances'>
            <button
              onClick={() => setShowBalance(true)}
              className='ml-2 mt-1 rounded-md border-2 border-white hover:bg-white'>
              <WalletIcon color='black' width={28} height={28} />
            </button>
          </Tooltip>
        </div>
        <div className='mt-2 flex items-center justify-between'>
          <div className='flex rounded-md border-2 border-white bg-white'>
            <button
              onClick={() => {
                navigator.clipboard
                  .writeText(data.publicAddress)
                  .then(() => setShowSuccessCopyAddress(true))
                  .finally(clearCopyNotification)
              }}
              className='flex items-center px-3 py-2 text-sm font-semibold uppercase hover:opacity-60'>
              <img src='/ethLogo.png' alt='eth logo' className='mr-2 h-4 w-2' />
              {formatEthAddress(data.publicAddress)}
            </button>

            <button
              className='rounded-r-md bg-gray-100 px-3 py-2 text-sm font-semibold hover:brightness-95'
              onClick={() => setOpen(true)}>
              Retrieve Private Key
            </button>
          </div>
        </div>
      </div>

      <Transition.Root show={showBalance} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setShowBalance}>
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

          <div className='fixed inset-0 right-0 z-10 overflow-y-auto overflow-x-hidden'>
            <div className='flex min-h-full items-end justify-end p-4 text-center sm:items-start sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-in duration-600'
                enterFrom='opacity-0 translate-x-20'
                enterTo='opacity-100 translate-x-0 '
                leave='ease-out duration-600'
                leaveFrom='opacity-100 translate-x-0'
                leaveTo='opacity-0 translate-x-20'>
                <Dialog.Panel className='relative h-full w-full max-w-sm transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:p-6'>
                  <div className='mb-5 flex items-center justify-between'>
                    <div className='flex items-center'>
                      <Blockies
                        size={10}
                        seed={data.publicAddress}
                        className='rounded-lg bg-white p-1 shadow-sm'
                      />
                      <p className='ml-2 font-semibold'>{data.username}</p>
                    </div>
                    <div>
                      <p className='ml-2 text-sm font-semibold text-gray-600'>
                        {formatEthAddress(data.publicAddress)}
                      </p>
                    </div>
                  </div>
                  <div className='mb-5 rounded-md border'>
                    <p className='mt-4 text-center text-lg font-bold tracking-tight'>
                      Balances
                    </p>
                    {Object.entries(balances).map((balance, index) => (
                      <div
                        key={index}
                        className='mx-10 flex items-center justify-between'>
                        <div className='my-5 flex items-center'>
                          <NetworkIcon
                            name={balance[0].toUpperCase() as Network}
                          />
                          <div className='ml-2 flex flex-col'>
                            <p className='text-sm font-normal text-gray-500'>
                              {balance[1].symbol}
                            </p>
                            <p className='text-base font-semibold'>
                              {balance[0] as Network}
                            </p>
                          </div>
                        </div>
                        <p className='text-center font-bold'>
                          {balance[1].formatted}
                        </p>
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <EjectPrivateKey
        show={open}
        onClose={setOpen}
        step={calculateStep()}
        error={actionData?.formError ? true : false}
      />
    </div>
  )
}

export default Index
