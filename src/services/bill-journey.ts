export type BillJourneyKind = 'billing' | 'compare'
export type BillJourneyStage = 'provider' | 'services' | 'upload'
export type BillJourneyState = {
  kind: BillJourneyKind
  stage: BillJourneyStage
  provider: string | null
  services: string | null
}

export function beginBillJourney(kind: BillJourneyKind): BillJourneyState {
  return { kind, stage: kind === 'compare' ? 'provider' : 'upload', provider: null, services: null }
}

export function answerBillJourney(state: BillJourneyState, answer: string): BillJourneyState {
  if (state.stage === 'provider') return { ...state, provider: answer, stage: 'services' }
  if (state.stage === 'services') return { ...state, services: answer, stage: 'upload' }
  return state
}

export function billJourneyPrompt(state: BillJourneyState): string {
  if (state.stage === 'provider') return 'Which provider’s bill would you like to compare with Rogers? You can choose below, or share a photo now and I’ll identify the provider and services if they’re visible. Would you like to share it?'
  if (state.stage === 'services') return 'Which services are on that bill? You can choose below, or share a photo now and I’ll identify the services if they’re visible. Would you like to share it?'
  return state.kind === 'billing'
    ? 'Would you like to share a photo of your bill so I can explain the visible charges and suggest possible ways to save? Choose Take a photo or Upload an image below. You can cover account numbers, your name, address, and payment details first.'
    : `Would you like to share a photo of your ${state.provider ?? 'current provider'} bill? Choose Take a photo or Upload an image below, and I’ll identify the visible services and monthly total to compare with an illustrative Rogers estimate. Please cover account numbers, name, address, and payment details first.`
}

export function detectBillJourneyKind(text: string): BillJourneyKind | null {
  const billTopic = /\b(bill|billing|invoice|statement|charges?)\b/i.test(text)
  const providerTopic = /\b(bell|telus|freedom|fido|virgin|rogers|provider|competitor)\b/i.test(text)
  const compareIntent = /\b(compare|comparison|switch|switching|change provider|compare prices|savings?)\b/i.test(text)
  if (compareIntent && (billTopic || providerTopic)) return 'compare'
  if (billTopic && /\b(understand|understanding|explain|review|analy[sz]e|help|question|talk|discuss|ask|look|send|share|upload|photo|picture|image|issue|concern|high|expensive)\b/i.test(text)) return 'billing'
  if (/^\s*(my bill|billing inquiry|bill question)\s*$/i.test(text)) return 'billing'
  return null
}

export function isBillComparisonRequest(text: string): boolean {
  return detectBillJourneyKind(text) === 'compare'
}

export function isBillingHelpRequest(text: string): boolean {
  return detectBillJourneyKind(text) === 'billing'
}

export function isBillImageShareRequest(text: string, recentContext: string): boolean {
  const mentionsBill = /\b(bill|billing|invoice|statement)\b/i.test(text)
  const asksToShareImage = /\b(photo|picture|image|snapshot|bill)\b/i.test(text)
    && /\b(can i|could i|may i|share|send|upload|attach|take|show|look at|view|analy[sz]e|check)\b/i.test(text)
  return mentionsBill && asksToShareImage || asksToShareImage && detectBillJourneyKind(recentContext) !== null
}

export function estimateRogersMonthly(services: string | null, lines: number | null): number | null {
  if (!services) return null
  const normalized = services.toLowerCase()
  let total = 0
  if (normalized.includes('mobile')) total += (lines ?? 1) * 65
  if (normalized.includes('internet')) total += 60
  if (normalized.includes('tv')) total += 25
  if (normalized.includes('home phone')) total += 10
  return total || null
}
