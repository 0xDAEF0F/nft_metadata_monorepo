import { createCookie, redirect } from '@remix-run/node'
import type { ZodIssue } from 'nestjs-zod/frontend'

export type BadRequestException = {
  statusCode: 400
  message: string
  error: 'Bad Request'
}

export function parseClientZodFormErrors(exception: { errors: ZodIssue[] }) {
  return exception.errors.map((issue) => {
    return [issue.path[0], issue.message] as const
  })
}

export async function requireJwt(request: Request) {
  const jwt = await createCookie('jwt').parse(request.headers.get('Cookie'))
  if (!jwt) throw redirect('/login')
  return jwt as string
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
