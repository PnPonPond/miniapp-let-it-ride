type ErrorResponse = {
  success: false
  message: string
  details?: string
  code?: string
}

export function mapErrorResponse(errorResult: ApiError): ErrorResponse {
  return {
    success: false,
    message: errorResult.error.message,
    details: errorResult.error.details,
    code: errorResult.error.code,
  }
}
