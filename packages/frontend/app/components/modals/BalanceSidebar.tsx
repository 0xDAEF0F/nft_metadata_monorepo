import { Dialog, Transition } from '@headlessui/react'
import type { Network } from '@prisma/client'
import { formatEthAddress } from 'eth-address'
import { Fragment, useEffect, useState } from 'react'
import Blockies from 'react-blockies'
import { NetworkIcon } from '../icons/NetworkIcon'

type Props = {
  prefetch: boolean
  user: {
    publicAddress: string
    username: string
  }
  show: boolean
  onClose: (_: boolean) => void
}

type Balances = Record<
  Network,
  {
    decimals: number
    formatted: string
    symbol: string
    value: { type: string; hex: string }
  }
>

// TODO: This component needs loaders
export function BalanceSidebar({ prefetch, user, show, onClose }: Props) {
  const [balances, setBalances] = useState<Balances>()

  useEffect(() => {
    if (!prefetch) return
    fetch(`http://localhost:3000/balance/${user.publicAddress}`)
      .then((res) => res.json())
      .then(setBalances)
      .catch(console.log)
  }, [user.publicAddress, prefetch])

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={onClose}>
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
                      seed={user.publicAddress}
                      className='rounded-lg bg-white p-1 shadow-sm'
                    />
                    <p className='ml-2 font-semibold'>{user.username}</p>
                  </div>
                  <div>
                    <p className='ml-2 text-sm font-semibold text-gray-600'>
                      {formatEthAddress(user.publicAddress)}
                    </p>
                  </div>
                </div>
                <div className='mb-5 rounded-md border'>
                  <p className='mt-4 text-center text-lg font-bold tracking-tight'>
                    Balances
                  </p>
                  {balances &&
                    Object.entries(balances).map((balance, index) => (
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
                          {Math.floor(+balance[1].formatted * 100) / 100}
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
  )
}
