const config = require('../config')

const jsonHeaders = { 'Content-Type': 'application/json' }

module.exports = async function (context) {
  console.log('[Anna Debug] AZURE_SPEECH_KEY exists:', Boolean(config.azureSpeechKey))
  console.log('[Anna Debug] AZURE_SPEECH_REGION exists:', Boolean(config.azureSpeechRegion))
  if (!config.azureSpeechKey || !config.azureSpeechRegion) {
    context.res = { headers: jsonHeaders, status: 503, body: { error: 'Speech is not configured.' } }
    return
  }
  try {
    const response = await fetch(`https://${encodeURIComponent(config.azureSpeechRegion)}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
      method: 'POST',
      headers: { 'Ocp-Apim-Subscription-Key': config.azureSpeechKey, 'Content-Length': '0' },
    })
    if (!response.ok) {
      context.log.error(`Azure Speech token request failed (${response.status}).`)
      context.res = { headers: jsonHeaders, status: 502, body: { error: 'Speech is temporarily unavailable.' } }
      return
    }
    context.res = { headers: jsonHeaders, status: 200, body: { token: await response.text(), region: config.azureSpeechRegion } }
  } catch (error) {
    context.log.error('Azure Speech token request failed.', error)
    context.res = { headers: jsonHeaders, status: 502, body: { error: 'Speech is temporarily unavailable.' } }
  }
}
