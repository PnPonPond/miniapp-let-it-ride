interface ApiResponse<T> {
  data: T
  status: Status
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
