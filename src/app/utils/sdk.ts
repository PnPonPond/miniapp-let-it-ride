import config from '@/app/config'

export const initSDK = async () => {
  if (window.MiniAppSDK) {
    await window.MiniAppSDK.init({
      appId: config.APP_ID,
      isDebug: true,
    })
  } else {
    console.error('MiniAppSDK not available')
  }
}

export const exchangeToken = async () => {
  if (window.MiniAppSDK) {
    return await window.MiniAppSDK.exchangeToken()
  } else {
    console.error('MiniAppSDK not available')
  }
}

export const closeMiniApp = async () => {
  if (window.MiniAppSDK && window.MiniAppSDK.closeMiniApp) {
    await window.MiniAppSDK.closeMiniApp()
  } else {
    console.error('MiniAppSDK not available')
  }
}

export const getAllmemberPoints = async () => {
  if (window.MiniAppSDK) {
    const data = await window.MiniAppSDK?.getAllMemberPoint()
    return data.point
  } else {
    console.error('MiniAppSDK not available or close function not defined')
    return 0
  }
}
