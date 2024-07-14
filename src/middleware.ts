import { NextRequest, NextResponse } from 'next/server'
import { default as AppConfig } from '@/app/config'

async function getUserServerToken(token: string): Promise<string> {
  try {
    const response = await fetch(`${AppConfig.URL}/api/get-user-server-token`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to issue user server token')
    }

    const data = await response.json()
    return data.data.accessToken
  } catch (error) {
    console.log('🔥  error:', error)
  }
  return ''
}

export async function middleware(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  const userToken = authorization.split(' ')[1]

  if (!userToken) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Check cookie
  let userServerToken = req.cookies.get('userServerToken')?.value

  // If no cookie, get a new token
  if (!userServerToken) {
    userServerToken = await getUserServerToken(userToken)
    if (!userServerToken) {
      return NextResponse.json(
        { success: false, message: 'Failed to get user server token' },
        { status: 500 }
      )
    }
  }

  // Create a new response with the user server token in the headers
  const response = NextResponse.next({
    headers: {
      Authorization: `Bearer ${userServerToken}`,
    },
  })

  return response
}

export const config = {
  matcher: ['/api/deduct-reward'],
}
