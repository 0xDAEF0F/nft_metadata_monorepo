import { redirect } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async () => {
  return redirect('/dashboard')
}

export default function Index() {
  return (
    <div>
      <p className='text-xl font-bold'>Home Page</p>
    </div>
  )
}
