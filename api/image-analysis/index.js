const config = require('../config')

const jsonHeaders = { 'Content-Type': 'application/json' }
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxImageBytes = 5 * 1024 * 1024
const analysisPrompt = `Analyze this customer-provided modem, gateway, router, or home-network image for troubleshooting. Carefully describe only visible evidence: modem lights and their apparent states/colors, equipment condition, visible error indicators, connection status clues, and cable configuration. Do not claim to run a live network test, identify an exact fault from ambiguous evidence, or infer information that is not visible. Return only a JSON object with exactly these fields: "issueSummary" (short plain-language summary), "likelyRootCause" (most likely explanation, or state that the image is inconclusive), "confidence" (integer from 0 to 100 indicating confidence in the visual assessment), and "recommendedAction" (one safe, practical next step). Mention uncertainty and advise not to unplug or move cables if doing so could interrupt service.`

module.exports = async function (context, req) {
  const { image, mimeType } = req.body || {}
  if (typeof image !== 'string' || !allowedMimeTypes.has(mimeType)) {
    context.res = { headers: jsonHeaders, status: 400, body: { error: 'Provide a JPG, PNG, or WEBP image.' } }
    return
  }

  const base64 = image.replace(/^data:image\/(?:jpeg|jpg|png|webp);base64,/i, '')
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64) || base64.length === 0) {
    context.res = { headers: jsonHeaders, status: 400, body: { error: 'The image data is invalid.' } }
    return
  }
  if (base64.length > Math.ceil(maxImageBytes / 3) * 4 + 4) {
    context.res = { headers: jsonHeaders, status: 413, body: { error: 'Images must be 5 MB or smaller.' } }
    return
  }
  const imageBuffer = Buffer.from(base64, 'base64')
  if (imageBuffer.length > maxImageBytes) {
    context.res = { headers: jsonHeaders, status: 413, body: { error: 'Images must be 5 MB or smaller.' } }
    return
  }
  const validSignature = mimeType === 'image/jpeg'
    ? imageBuffer[0] === 0xff && imageBuffer[1] === 0xd8 && imageBuffer[2] === 0xff
    : mimeType === 'image/png'
      ? imageBuffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
      : imageBuffer.toString('ascii', 0, 4) === 'RIFF' && imageBuffer.toString('ascii', 8, 12) === 'WEBP'
  if (!validSignature) {
    context.res = { headers: jsonHeaders, status: 400, body: { error: 'The file contents do not match a supported image format.' } }
    return
  }
  if (!config.azureOpenAIEndpoint || !config.azureOpenAIAPIKey) {
    context.res = { headers: jsonHeaders, status: 503, body: { error: 'Image analysis is not configured.' } }
    return
  }

  const endpoint = config.azureOpenAIEndpoint.replace(/\/+$/, '')
  const url = `${endpoint}/openai/deployments/${encodeURIComponent(config.azureOpenAIDeployment)}/chat/completions?api-version=${encodeURIComponent(config.azureOpenAIAPIVersion)}`
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': config.azureOpenAIAPIKey },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are Anna, a careful home-network troubleshooting assistant. Analyze visible evidence only, prioritize safety, and return valid JSON only.' },
          { role: 'user', content: [
            { type: 'text', text: analysisPrompt },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}`, detail: 'high' } },
          ] },
        ],
        max_tokens: 500,
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
    })
    if (!response.ok) {
      context.log.error(`Azure image analysis failed (${response.status}).`)
      context.res = { headers: jsonHeaders, status: 502, body: { error: 'Image analysis is temporarily unavailable.' } }
      return
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    const analysis = typeof content === 'string' ? JSON.parse(content) : null
    if (!analysis || typeof analysis.issueSummary !== 'string' || typeof analysis.likelyRootCause !== 'string' || !Number.isFinite(Number(analysis.confidence)) || typeof analysis.recommendedAction !== 'string') {
      context.log.error('Azure image analysis returned an invalid response shape.')
      context.res = { headers: jsonHeaders, status: 502, body: { error: 'Image analysis returned an invalid result. Please try another image.' } }
      return
    }
    context.res = {
      headers: jsonHeaders,
      status: 200,
      body: {
        issueSummary: analysis.issueSummary,
        likelyRootCause: analysis.likelyRootCause,
        confidence: Math.max(0, Math.min(100, Math.round(Number(analysis.confidence)))),
        recommendedAction: analysis.recommendedAction,
      },
    }
  } catch (error) {
    context.log.error('Azure image analysis request failed.', error)
    context.res = { headers: jsonHeaders, status: 502, body: { error: 'Image analysis is temporarily unavailable.' } }
  }
}
