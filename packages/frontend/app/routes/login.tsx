import { redirect, json, fetch, createCookie } from '@remix-run/node'
import { Link, useActionData } from '@remix-run/react'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { requireJwt } from '~/lib/helpers'

export const loader: LoaderFunction = async ({ request }) => {
  await requireJwt(request)
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const username = form.get('username')
  const password = form.get('password')

  if (!username || !password)
    return json({ formError: 'Unauthorized' }, { status: 401 })

  const res = await fetch(process.env.API_BASE_URL + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (res.ok) {
    const { access_token } = (await res.json()) as { access_token: string }
    return redirect('/dashboard', {
      headers: {
        'Set-Cookie': await createCookie('jwt').serialize(access_token),
      },
    })
  }

  return json({ formError: 'Unauthorized' }, { status: 401 })
}

export default function Login() {
  const actionData = useActionData<{ formError: string }>()

  const inputBorder =
    actionData && actionData.formError === 'Unauthorized'
      ? 'border border-red-600'
      : 'border-gray-200'

  return (
    <div className='mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-lg'>
        <h1 className='text-center text-2xl font-bold text-indigo-600 sm:text-3xl'>
          Welcome To Reliks
        </h1>
        <form
          method='post'
          action='/login'
          className='mt-6 mb-0 space-y-4 rounded-lg p-8 shadow-2xl'>
          <div>
            <p className='text-lg font-medium'>Log in</p>
            {actionData && actionData.formError === 'Unauthorized' ? (
              <p className='mt-1 text-xs text-red-600'>
                Wrong username or password
              </p>
            ) : (
              ''
            )}
          </div>

          <div>
            <label htmlFor='username' className='text-sm font-medium'>
              Username
            </label>

            <div className='relative mt-1'>
              <input
                name='username'
                id='username'
                type='text'
                className={`w-full rounded-lg p-4 pr-12 text-sm shadow-sm ${inputBorder}`}
                placeholder='Enter username'
              />

              <span className='absolute inset-y-0 right-4 inline-flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                  />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor='password' className='text-sm font-medium'>
              Password
            </label>

            <div className='relative mt-1'>
              <input
                name='password'
                id='password'
                type='password'
                className={`w-full rounded-lg p-4 pr-12 text-sm shadow-sm ${inputBorder}`}
                placeholder='Enter password'
              />

              <span className='absolute inset-y-0 right-4 inline-flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                  />
                </svg>
              </span>
            </div>
          </div>

          <button
            type='submit'
            className='block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white'>
            Sign in
          </button>

          <p className='text-center text-sm text-gray-500'>
            No account?{' '}
            <Link className='underline' to='/register'>
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
