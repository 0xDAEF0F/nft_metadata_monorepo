import { Outlet, useLocation } from '@remix-run/react'
import { Link } from '@remix-run/react'
import { HomeIcon, RectangleGroupIcon } from '@heroicons/react/20/solid'
import cx from 'classnames'

export default function Dashboard() {
  const location = useLocation()

  return (
    // sidebar
    <div className='min-h-full'>
      <div className='fixed inset-y-0 flex h-screen w-16 flex-col justify-between border-r bg-white'>
        <div>
          <div className='inline-flex h-16 w-16 items-center justify-center'>
            <span className='block h-10 w-10 rounded-lg bg-gray-200'></span>
          </div>

          <div className='border-t border-gray-100'>
            <nav aria-label='Main Nav' className='flex flex-col p-2'>
              <div className='py-4'>
                <Link
                  to='/dashboard'
                  className={cx(
                    location.pathname.includes('dashboard') && 'bg-blue-50',
                    'group relative flex justify-center rounded px-2 py-1.5 text-blue-700',
                  )}>
                  <HomeIcon
                    width={20}
                    opacity='75%'
                    fill='none'
                    stroke='gray'
                    strokeWidth='2px'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <span className='absolute left-full top-1/2 ml-4 hidden -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:block'>
                    General
                  </span>
                </Link>
              </div>
              <ul className='space-y-1 border-t border-gray-100 pt-4'>
                <li>
                  <Link
                    to='/collections'
                    className={cx(
                      location.pathname.includes('collections') && 'bg-blue-50',
                      'group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700',
                    )}>
                    <RectangleGroupIcon
                      width={20}
                      opacity='75%'
                      fill='none'
                      stroke='gray'
                      strokeWidth='2px'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <span className='absolute left-full top-1/2 ml-4 hidden -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:block'>
                      Collections
                    </span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className='sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2'>
          <form method='POST' action='/logout'>
            <button
              type='submit'
              className='group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 opacity-75'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth='2'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                />
              </svg>

              <span className='absolute left-full top-1/2 ml-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100'>
                Logout
              </span>
            </button>
          </form>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
