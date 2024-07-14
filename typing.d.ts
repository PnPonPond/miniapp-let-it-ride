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
