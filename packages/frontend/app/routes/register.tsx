import { redirect, json, fetch, createCookie } from '@remix-run/node'
import { Link, useActionData } from '@remix-run/react'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import type { ZodIssue } from 'nestjs-zod/frontend'
import { PleaseUseComputer } from '~/components/popovers/PleaseUseComputer'

type ActionData = {
  formError?: string
  fieldError?: {
    username?: string[]
    password?: string[]
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const jwt = await createCookie('jwt').parse(request.headers.get('Cookie'))
  if (jwt) return redirect('/dashboard')
  return null
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const username = form.get('username')
  const password = form.get('password')

  if (!username || !password)
    return json({ formError: 'Missing Username or Password' })

  const res = await fetch(process.env.API_BASE_URL + '/auth/register', {
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
  const data = await res.json()
  const zodErrors = data.errors as ZodIssue[]

  if (zodErrors) {
    const usernameError = zodErrors
      .filter((issue) => issue.path[0] === 'username')
      .map((i) => i.message)

    const passwordError = zodErrors
      .filter((issue) => issue.path[0] === 'password')
      .map((i) => i.message)

    return json({
      fieldError: {
        username: usernameError,
        password: passwordError,
      },
    })
  }

  return json({ formError: data.message })
}

export default function Register() {
  const actionData = useActionData<ActionData>()

  const usernameErrors = actionData?.fieldError?.username?.map((msg, idx) => {
    return (
      <li className='list-disc text-xs text-red-600' key={idx}>
        {msg}
      </li>
    )
  })
  const passwordErrors = actionData?.fieldError?.password?.map((msg, idx) => {
    return (
      <li className='list-disc text-xs text-red-600' key={idx}>
        {msg}
      </li>
    )
  })

  return (
    <PleaseUseComputer>
      <div className='mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-lg'>
          <h1 className='text-center text-2xl font-bold text-indigo-600 sm:text-3xl'>
            Welcome To Reliks
          </h1>
          <form
            method='post'
            action='/register'
            className='mt-6 mb-0 space-y-4 rounded-lg p-8 shadow-2xl'>
            <div>
              <p className='text-lg font-medium'>Register</p>
              {actionData && actionData.formError ? (
                <p className='mt-1 text-xs text-red-600'>
                  {actionData.formError}
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
                  className={`w-full rounded-lg p-4 pr-12 text-sm shadow-sm ${
                    (actionData && actionData.formError) ||
                    actionData?.fieldError?.username?.length
                      ? 'border border-red-600'
                      : 'border-gray-200'
                  }`}
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
              {usernameErrors && (
                <ul className='mt-1 ml-4'>{usernameErrors}</ul>
              )}
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
                  className={`w-full rounded-lg p-4 pr-12 text-sm shadow-sm ${
                    (actionData && actionData.formError) ||
                    actionData?.fieldError?.password?.length
                      ? 'border border-red-600'
                      : 'border-gray-200'
                  }`}
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
              {passwordErrors && (
                <ul className='mt-1 ml-4'>{passwordErrors}</ul>
              )}
            </div>

            <button
              type='submit'
              className='block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white'>
              Sign in
            </button>

            <p className='text-center text-sm text-gray-500'>
              Already have an account?{' '}
              <Link className='underline' to='/login'>
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </PleaseUseComputer>
  )
}
