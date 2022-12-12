import { Link, Outlet, useParams, useLocation } from '@remix-run/react'
import cx from 'classnames'

export default function Collection() {
  const location = useLocation()
  const params = useParams()

  return (
    <div className='border-b border-gray-200 bg-white'>
      <nav className='-mb-px flex h-16 space-x-8' aria-label='Tabs'>
        <Link
          to={`/collections/${params.collectionId}`}
          className={cx(
            location.pathname === `/collections/${params.collectionId}`
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            'whitespace-nowrap border-b-2 px-1 pt-6 text-sm font-medium',
          )}>
          Overview
        </Link>
        <Link
          to={`/collections/${params.collectionId}/batch-metadata`}
          className={cx(
            location.pathname ===
              `/collections/${params.collectionId}/batch-metadata`
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            'whitespace-nowrap border-b-2 px-1 pt-6 text-sm font-medium',
          )}>
          Metadata
        </Link>
        <Link
          to={`/collections/${params.collectionId}/batch-images`}
          className={cx(
            location.pathname ===
              `/collections/${params.collectionId}/batch-images`
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            'whitespace-nowrap border-b-2 px-1 pt-6 text-sm font-medium',
          )}>
          Images
        </Link>
      </nav>
      <Outlet />
    </div>
  )
}
