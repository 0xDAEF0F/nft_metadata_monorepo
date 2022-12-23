import { createCookie, redirect } from '@remix-run/node'
import type { ActionFunction } from '@remix-run/node'

// logout action
export const action: ActionFunction = async () => {
  return redirect('/login', {
    headers: {
      'Set-Cookie': await createCookie('jwt').serialize('', {
        expires: new Date(Date.now() - 1000),
      }),
    },
  })
}
