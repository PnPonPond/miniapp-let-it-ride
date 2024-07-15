'use server'
import config from '@/app/config'

export async function getCoupon(token: string) {
  try {
    const response = await fetch(`${config.NEXT_URL}/api/get-coupon`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    return true
  } catch (error) {
    return false
  }
}
