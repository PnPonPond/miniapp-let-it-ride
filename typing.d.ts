interface ApiResponse<T> {
  data: T
  status: Status
}

interface ApiError {
  error: {
    code: string
    message: string
    details: string
  }
}

interface ExchangeTokenResponse {
  accessToken: string
}

interface AllMemberPoint {
  point: number
}

interface DeductTran {
  tranId: string
}

interface Coupon {
  id: string
  name: string
  description: string
  isActive: boolean
  startAt: string
  expireAt: string
  campaignPartnerCode: string
  imageUrl: string
  promotionCode: string
  campaignId: string
  campaignQty: number
  rewardQty: number
}
