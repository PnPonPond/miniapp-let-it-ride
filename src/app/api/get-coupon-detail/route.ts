import config from '@/app/config'
import { mapErrorResponse } from '@/app/utils/mapErrorResponse'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const token = authorization?.split(' ')[1]

  try {
    const response = await fetch(
      `${config.SUPERAPP_URL}/spa/coupon/v1/${config.CAMPAIGN_PARTNER_CODE}/${config.COUPON_ID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log('🔥  response:', response)

    if (!response.ok) {
      const errorResult = await response.json()
      return new Response(JSON.stringify(mapErrorResponse(errorResult)), {
        status: response.status,
      })
    }

    const result: ApiResponse<Coupon> = await response.json()
    console.log('🔥  result:', result)
    return new Response(JSON.stringify({ success: true, data: result.data }), {
      status: 200,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to get coupon detail',
      }),
      {
        status: 500,
      }
    )
  }
}
