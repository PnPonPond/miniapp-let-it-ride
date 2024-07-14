import { NextRequest } from 'next/server'

import config from '@/app/config'

const basicAuth = btoa(`${config.SERVER_ID}:${config.SERVER_SECRET}`)

export async function GET(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const userToken = authorization?.split(' ')[1]

  try {
    const response = await fetch(`${config.DOMAIN}/spa/oauth2/v1/users/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        userAccessToken: userToken,
      }),
    })

    if (!response.ok) {
      const errorResult = await response.json()
      return new Response(
        JSON.stringify({
          success: false,
          message: errorResult.error.message,
          details: errorResult.error.details,
          code: errorResult.error.code,
        }),
        {
          status: 400,
        }
      )
    }

    const result: ApiResponse<ExchangeTokenResponse> = await response.json()
    return new Response(JSON.stringify({ success: true, data: result.data }), {
      status: 200,
      headers: {
        'Set-Cookie': `userServerToken=${result.data.accessToken}; sameSite=strict; httpOnly=true; maxAge=60*60*1`,
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to issue user server token',
      }),
      {
        status: 500,
      }
    )
  }
}
