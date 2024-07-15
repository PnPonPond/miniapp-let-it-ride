'use server'
import config from '@/app/config'

export async function getCouponDetail(token: string): Promise<Coupon> {
  try {
    const response = await fetch(`${config.NEXT_URL}/api/get-coupon-detail`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'default',
    })

    const { data }: ApiResponse<Coupon> = await response.json()
    return data
  } catch (error) {
    console.log('🔥  error:', error)
    throw error
  }
}
