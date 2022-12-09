import { createCookie, redirect } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/node'
import { DashboardSidebar } from '~/components/sidebar/DashboardSidebar'

// logout action
export const action: ActionFunction = async () => {
  return redirect('/login', {
    headers: {
      'Set-Cookie': await createCookie('jwt', {
        expires: new Date(Date.now() - 1000),
      }).serialize(''),
    },
  })
}

export default function Dashboard() {
  return (
    <>
      <div className='min-h-full'>
        <DashboardSidebar />
        <Outlet />
      </div>
    </>
  )
}
