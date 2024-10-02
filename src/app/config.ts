const config = {
  REWARD_ID: Number(process.env.REWARD_ID) || 0,
  REWARD_QTY: Number(process.env.REWARD_QTY) || 1,
  CAMPAIGN_ID: process.env.CAMPAIGN_ID || '',
  SUPERAPP_URL: process.env.SUPERAPP_URL || '',
  APP_ID: process.env.APP_ID || 'my-miniapp1',
  SERVER_ID: process.env.SERVER_ID || 'my-miniapp-server1',
  SERVER_SECRET:
    process.env.SERVER_SECRET || '3bs4Wd5GOhagOWFAFB7GOLtHGMGEwkRx',
  NEXT_URL: process.env.NEXT_URL || 'https://pon-pond.ngrok.app/',
  // TEST COUPON
  // COUPON_ID: process.env.TEST_COUPON_ID || '',
  // REAL COUPON
  COUPON_ID: process.env.COUPON_ID || '',
  CAMPAIGN_PARTNER_CODE: process.env.CAMPAIGN_PARTNER_CODE || '',
}

export default config
