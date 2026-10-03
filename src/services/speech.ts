import type * as SdkTypes from 'microsoft-cognitiveservices-speech-sdk'

const loadSdk = () => import('microsoft-cognitiveservices-speech-sdk')

type SpeechToken = { token: string; region: string }

let cached: { value: SpeechToken; expires: number } | null = null

async function getToken(): Promise<SpeechToken> {
  if (cached && cached.expires > Date.now()) return cached.value
  const response = await fetch('/api/speech-token', { method: 'POST' })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.token) throw new Error(data?.error || 'Speech is not available right now.')
  cached = { value: data, expires: Date.now() + 8 * 60 * 1000 }
  return data
}

export async function isSpeechAvailable(): Promise<boolean> {
  try {
    await getToken()
    return true
  } catch {
    return false
  }
}

export async function listenOnce(): Promise<string> {
  const { token, region } = await getToken()
  const sdk = await loadSdk()
  const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region)
  speechConfig.speechRecognitionLanguage = 'en-CA'
  const recognizer = new sdk.SpeechRecognizer(speechConfig, sdk.AudioConfig.fromDefaultMicrophoneInput())
  return new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      (result) => {
        recognizer.close()
        if (result.reason === sdk.ResultReason.RecognizedSpeech && result.text) resolve(result.text)
        else reject(new Error('I didn’t catch that. Please try again.'))
      },
      (error) => {
        recognizer.close()
        reject(new Error(typeof error === 'string' ? error : 'Microphone is not available.'))
      },
    )
  })
}

let activeSynthesizer: SdkTypes.SpeechSynthesizer | null = null

export function stopSpeaking() {
  activeSynthesizer?.close()
  activeSynthesizer = null
}

export async function speak(text: string): Promise<void> {
  stopSpeaking()
  const { token, region } = await getToken()
  const sdk = await loadSdk()
  const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region)
  speechConfig.speechSynthesisVoiceName = 'en-CA-ClaraNeural'
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, sdk.AudioConfig.fromDefaultSpeakerOutput())
  activeSynthesizer = synthesizer
  await new Promise<void>((resolve) => {
    synthesizer.speakTextAsync(
      text.slice(0, 1500),
      () => { synthesizer.close(); if (activeSynthesizer === synthesizer) activeSynthesizer = null; resolve() },
      () => { synthesizer.close(); if (activeSynthesizer === synthesizer) activeSynthesizer = null; resolve() },
    )
  })
}
