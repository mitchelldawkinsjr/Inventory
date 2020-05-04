'use strict'
const APP_URL = ''

module.exports = {
  NODE_ENV: '"production"',
  BACKEND_URL: '"https://ww...j2y2.execute-api.us-east-1.amazonaws.com/latest/micro-post"',
  AUTH0_CLIENT_ID: '"Pf1...lJm"',
  AUTH0_DOMAIN: '"bk-prod.auth0.com"',
  AUTH0_LOGOUT_URL: `"${APP_URL}"`,
  AUTH0_CALLBACK_URL: `"${APP_URL}callback"`
}
