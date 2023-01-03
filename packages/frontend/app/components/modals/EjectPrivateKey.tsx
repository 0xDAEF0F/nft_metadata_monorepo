import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Form, useActionData } from '@remix-run/react'
import {
  LockClosedIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline'
import cx from 'classnames'
import { formatEthAddress } from 'eth-address'

export function EjectPrivateKey({
  show,
  onClose,
  step,
  error,
}: {
  show: boolean
  onClose: (b: boolean) => void
  step: 'A' | 'B'
  error: boolean
}) {
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
                {step === 'A' ? <ComponentA error={error} /> : <ComponentB />}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

// if error there username or password is incorrect
function ComponentA({ error }: { error: boolean }) {
  console.log({ error })
  return (
    <>
      <Steps
        steps={[
          { name: 'Auth', status: 'current' },
          { name: 'Display', status: 'upcoming' },
        ]}
      />
      <div className='mt-3 text-left sm:mt-5'>
        <Dialog.Title
          as='h3'
          className='text-center text-lg font-medium leading-6 text-gray-900'>
          Provide Your Credentials
        </Dialog.Title>
        <Form method='post' action='/dashboard?index' className='mt-2'>
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-700'>
              Username
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
              Password
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
            <button className='inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-offset-2 sm:text-sm'>
              Retrieve
            </button>
          </div>
        </Form>
      </div>
    </>
  )
}

function ComponentB() {
  const actionData = useActionData()

  return (
    <>
      <Steps
        steps={[
          { name: 'Auth', status: 'complete' },
          { name: 'Display', status: 'current' },
        ]}
      />
      <div className='mt-3 space-y-2 text-left sm:mt-5'>
        <Dialog.Title className='flex justify-center' as='div'>
          <LockClosedIcon className='' width={24} />
        </Dialog.Title>
        <div className='mx-auto w-11/12 space-y-2'>
          <p className='text-center text-sm'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum ut
            provident esse repellendus, omnis officiis illum voluptates sint
            eaque eveniet, sed iusto tempore quae dolore vel excepturi. Iste,
            voluptates porro.
          </p>
          <div className='mt-1 flex h-9 items-center justify-around rounded-sm border border-gray-200'>
            <p className='text-sm'>
              {formatEthAddress(actionData.publicAddress)}
            </p>
            <ClipboardDocumentListIcon
              className='cursor-pointer'
              onClick={() => {
                navigator.clipboard.writeText(actionData.privateKey)
              }}
              width={24}
            />
          </div>
        </div>
      </div>
    </>
  )
}

// TODO: this component is overkill
function Steps({
  steps,
}: {
  steps: { name: string; status: 'complete' | 'current' | 'upcoming' }[]
}) {
  return (
    <nav className='flex items-center justify-center' aria-label='Progress'>
      <ol className='flex items-center space-x-5'>
        {steps.map((step) => (
          <li key={step.name}>
            {step.status === 'complete' ? (
              <span className='block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900'>
                <span className='sr-only'>{step.name}</span>
              </span>
            ) : step.status === 'current' ? (
              <span
                className='relative flex items-center justify-center'
                aria-current='step'>
                <span className='absolute flex h-5 w-5 p-px' aria-hidden='true'>
                  <span className='h-full w-full rounded-full bg-indigo-200' />
                </span>
                <span
                  className='relative block h-2.5 w-2.5 rounded-full bg-indigo-600'
                  aria-hidden='true'
                />
                <span className='sr-only'>{step.name}</span>
              </span>
            ) : (
              <span className='block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400'>
                <span className='sr-only'>{step.name}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
