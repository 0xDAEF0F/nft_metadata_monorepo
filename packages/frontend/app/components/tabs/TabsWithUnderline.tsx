import { Link } from '@remix-run/react'
import cx from 'classnames'

type Tab = {
  name: string
  to: string
  current: boolean
}

export function TabsWithUnderline({ tabs }: { tabs: Tab[] }) {
  return (
    <div className='bg-white'>
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.to}
              className={cx(
                tab.current
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
              )}
              aria-current={tab.current ? 'page' : undefined}>
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
