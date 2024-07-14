import config from '@/app/config'
import { mapErrorResponse } from '@/app/utils/mapErrorResponse'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const token = authorization?.split(' ')[1]

  try {
    const response = await fetch(
      `${config.DOMAIN}/spa/loyalty/v1/rewards/${config.REWARD_ID}/deduct`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaignId: config.CAMPAIGN_ID,
          rewardQty: config.REWARD_QTY,
        }),
      }
    )

    if (!response.ok) {
      const errorResult = await response.json()
      return new Response(JSON.stringify(mapErrorResponse(errorResult)), {
        status: response.status,
      })
    }

    const result: ApiResponse<DeductTran> = await response.json()
    return new Response(JSON.stringify({ success: true, data: result.data }), {
      status: 200,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to deduct points',
      }),
      {
        status: 500,
      }
    )
  }
}
