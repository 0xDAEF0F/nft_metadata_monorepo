import { Link, Outlet } from '@remix-run/react'
import cx from 'classnames'

const tabs = [{ name: 'Overview', to: '/', current: true }]

export default function Collection() {
  return (
    <div className='border-b border-gray-200 bg-white'>
      <nav className='-mb-px flex h-16 space-x-8' aria-label='Tabs'>
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            to={tab.to}
            className={cx(
              tab.current
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'whitespace-nowrap border-b-2 px-1 pt-6 text-sm font-medium',
            )}
            aria-current={tab.current ? 'page' : undefined}>
            {tab.name}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
