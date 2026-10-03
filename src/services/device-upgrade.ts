import { PhoneProduct, productCards } from './offers'

export type DeviceUpgradeStage = 'currentDevice' | 'priorities' | 'budget' | 'recommendation'
export type DeviceUpgradeBrand = PhoneProduct['line'] | 'Other'
export type DeviceUpgradePriority = 'camera' | 'battery' | 'performance' | 'value'
export type DeviceUpgradeBudget = 'under-30' | '30-to-50' | 'flexible'

export type DeviceUpgradeState = {
  stage: DeviceUpgradeStage
  currentDevice: string | null
  preferredBrand: DeviceUpgradeBrand | null
  priorities: DeviceUpgradePriority[]
  budget: DeviceUpgradeBudget | null
  recommendation: PhoneProduct | null
}

export function isDeviceUpgradeRequest(message: string): boolean {
  return /\b(?:upgrade|upgrading|new phone|new device|shop(?:ping)? for (?:a )?phone|looking for (?:a )?(?:new )?phone|replace my phone|phone recommendation)\b/i.test(message)
}

export function beginDeviceUpgrade(): DeviceUpgradeState {
  return {
    stage: 'currentDevice',
    currentDevice: null,
    preferredBrand: null,
    priorities: [],
    budget: null,
    recommendation: null,
  }
}

export function advanceDeviceUpgrade(state: DeviceUpgradeState, answer: string): DeviceUpgradeState {
  if (state.stage === 'currentDevice') {
    const normalized = answer.toLowerCase()
    const preferredBrand: DeviceUpgradeBrand = /\b(iphone|apple|ios)\b/.test(normalized)
      ? 'Apple'
      : /\b(samsung|galaxy|android)\b/.test(normalized)
        ? 'Samsung'
        : /\b(pixel|google)\b/.test(normalized)
          ? 'Google'
          : 'Other'
    return { ...state, stage: 'priorities', currentDevice: answer.trim(), preferredBrand }
  }
  if (state.stage === 'priorities') {
    const normalized = answer.toLowerCase()
    const priorities: DeviceUpgradePriority[] = []
    if (/\b(camera|photo|photos|picture)\b/.test(normalized)) priorities.push('camera')
    if (/\b(battery|all.day|lasting)\b/.test(normalized)) priorities.push('battery')
    if (/\b(gaming|game|performance|fast|power)\b/.test(normalized)) priorities.push('performance')
    if (/\b(value|price|afford|budget|lower|save)\b/.test(normalized)) priorities.push('value')
    return { ...state, stage: 'budget', priorities: priorities.length ? priorities : ['value'] }
  }
  if (state.stage === 'budget') {
    const normalized = answer.toLowerCase()
    const budget: DeviceUpgradeBudget = /\b(under|less than|below|maximum|max|30 or less|30\/mo)\b/.test(normalized)
      ? 'under-30'
      : /\b(30|50|middle|moderate)\b/.test(normalized)
        ? '30-to-50'
        : 'flexible'
    const recommendation = recommendDevice(state.preferredBrand, state.priorities, budget)
    return { ...state, stage: 'recommendation', budget, recommendation }
  }
  return state
}

function recommendDevice(
  brand: DeviceUpgradeBrand | null,
  priorities: DeviceUpgradePriority[],
  budget: DeviceUpgradeBudget,
): PhoneProduct {
  const preferred = brand && brand !== 'Other' ? brand : null
  const candidates = preferred ? productCards.filter((product) => product.line === preferred) : productCards
  const targetLine = budget === 'under-30'
    ? candidates.find((product) => /iPhone 17$|Galaxy S26$|Pixel 11/.test(product.name))
    : budget === '30-to-50'
      ? candidates.find((product) => /iPhone 18 Pro$/.test(product.name)) ?? candidates.find((product) => /Plus/.test(product.name)) ?? candidates.find((product) => /iPhone 17$|Galaxy S26$|Pixel 11/.test(product.name))
      : priorities.includes('performance') || priorities.includes('camera') || priorities.includes('battery')
        ? candidates.find((product) => /Pro Max|Ultra/.test(product.name)) ?? candidates[0]
        : candidates.find((product) => /iPhone 18 Pro$/.test(product.name)) ?? candidates.find((product) => /Plus/.test(product.name)) ?? candidates[0]
  return targetLine ?? productCards[0]
}

export function deviceUpgradeQuestion(stage: DeviceUpgradeStage): string {
  switch (stage) {
    case 'currentDevice': return 'Let’s find an upgrade that fits. What phone do you use now—iPhone, Samsung Galaxy, Google Pixel, or something else?'
    case 'priorities': return 'Thanks. What matters most in your next phone: camera, battery life, gaming and performance, or value?'
    case 'budget': return 'What monthly device budget feels comfortable: under $30, around $30–$50, or flexible for the right phone?'
    case 'recommendation': return 'Based on what you shared, here’s a phone to consider.'
  }
}

export function describeDeviceMatch(state: DeviceUpgradeState): string {
  const priorities = state.priorities.map((priority) => ({
    camera: 'camera quality',
    battery: 'battery life',
    performance: 'performance',
    value: 'value',
  }[priority]))
  return `Matched to your ${state.preferredBrand && state.preferredBrand !== 'Other' ? `${state.preferredBrand} preference and ` : ''}${priorities.join(' and ') || 'everyday use'}${state.budget === 'under-30' ? ', with a lower monthly budget in mind' : state.budget === '30-to-50' ? ', within your $30–$50 monthly range' : ''}.`
}

export function deviceMonthlyPrice(product: PhoneProduct): number | null {
  const match = product.monthlyPrice?.match(/\$([\d.]+)\s*\/mo/i)
  return match ? Number(match[1]) : null
}
