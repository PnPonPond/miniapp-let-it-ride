declare global {
  interface Window {
    MiniAppSDK?: {
      init: ({
        appId,
        isDebug,
      }: {
        appId: string
        isDebug: boolean
      }) => Promise<void>
      exchangeToken: () => Promise<ExchangeTokenResponse>
      closeMiniApp: () => Promise<void>
      getAllMemberPoint: () => Promise<AllMemberPoint>
    }
  }
}

export {}
