import { createCookie } from '@remix-run/node'

export function extractJwt(request: Request): Promise<null | string> {
  return createCookie('jwt').parse(request.headers.get('Cookie'))
}

export function fetchWithJwt(
  relativeUrl: string,
  jwt: string,
): Promise<Response> {
  return fetch(process.env.API_BASE_URL + relativeUrl, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
}
