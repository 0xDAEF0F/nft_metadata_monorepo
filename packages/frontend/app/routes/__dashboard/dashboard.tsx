import { useState } from 'react'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, useActionData } from '@remix-run/react'
import { fetchWithJwt, requireJwt } from '~/lib/helpers'
import { formatEthAddress } from 'eth-address'
import { Tooltip } from 'flowbite-react'
import { Notification } from '~/components/popovers/Notification'
import Blockies from 'react-blockies'
import { EjectPrivateKey } from '~/components/modals/EjectPrivateKey'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import type { User } from '@prisma/client'
import { WalletIcon } from '@heroicons/react/24/outline'
import { BalanceSidebar } from '~/components/modals/BalanceSidebar'

export const loader: LoaderFunction = async ({ request }) => {
  const jwt = await requireJwt(request)

  const res = await fetchWithJwt('/auth/whoami', jwt)
  if (!res.ok) return redirect('/login')
  return json(await res.json())
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
  const user = useLoaderData<Pick<User, 'id' | 'username' | 'publicAddress'>>()
  const actionData = useActionData<ActionData>()

  const [showBalances, setShowBalances] = useState(false)
  const [fetchBalances, setFetchBalances] = useState(false)
  const [showEjectPkModal, setShowEjectPKModal] = useState<boolean>(
    actionData ? true : false,
  )

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
            user.publicAddress,
          )} copied to clipboard`,
        }}
      />
      <div className='mx-auto mt-10 max-w-7xl p-6'>
        {/* TODO: This blockie is giving a warning (componentWillUpdate) */}
        <Blockies
          size={10}
          scale={10}
          seed={user.publicAddress}
          className='rounded-lg bg-white p-1 shadow-sm'
        />

        <div className='mt-3 flex items-center'>
          <p className='text-3xl font-semibold'>{user.username}</p>
          <Tooltip arrow={false} content='Balances'>
            <button
              onClick={() => setShowBalances(true)}
              className='ml-2 mt-1 rounded-md border-2 border-white hover:bg-white'>
              <WalletIcon
                onMouseEnter={() => {
                  setFetchBalances(true)
                }}
                color='black'
                width={28}
                height={28}
              />
            </button>
          </Tooltip>
        </div>
        <div className='mt-2 flex items-center justify-between'>
          <div className='flex rounded-md border-2 border-white bg-white'>
            <button
              onClick={() => {
                navigator.clipboard
                  .writeText(user.publicAddress)
                  .then(() => setShowSuccessCopyAddress(true))
                  .finally(clearCopyNotification)
              }}
              className='flex items-center px-3 py-2 text-sm font-semibold uppercase hover:opacity-60'>
              <img src='/ethLogo.png' alt='eth logo' className='mr-2 h-4 w-2' />
              {formatEthAddress(user.publicAddress)}
            </button>

            <button
              className='rounded-r-md bg-gray-100 px-3 py-2 text-sm font-semibold hover:brightness-95'
              onClick={() => setShowEjectPKModal(true)}>
              Retrieve Private Key
            </button>
          </div>
        </div>
      </div>
      <BalanceSidebar
        prefetch={fetchBalances}
        user={user}
        onClose={setShowBalances}
        show={showBalances}
      />
      <EjectPrivateKey
        show={showEjectPkModal}
        onClose={setShowEjectPKModal}
        step={calculateStep()}
        error={actionData?.formError ? true : false}
      />
    </div>
  )
}

export default Index
