// Refreshes src/data/rogers-device-pricing.json from the public Rogers device catalog.
// Usage: node scripts/refresh-rogers-device-pricing.mjs
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const sourcePage = 'https://www.rogers.com/phones'
const endpoint = 'https://www.rogers.com/api/catalogds/v1/local/devices/search?activityType=nac'
const output = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/rogers-device-pricing.json')

const response = await fetch(endpoint, {
  headers: {
    Accept: 'application/json',
    accounttype: 'Consumer',
    accountsubtype: 'Regular',
    activitytype: 'NAC',
    applicationid: 'Rogers.com',
    applytradein: 'false',
    devicepricetier: 'true',
    devicetradein: 'true',
    lang: 'en',
    province: 'ON',
    Referer: sourcePage,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
  },
})
if (!response.ok) throw new Error(`Rogers catalog request failed (${response.status})`)

const { devices } = await response.json()
const round = (value) => Math.round(Number(value) * 100) / 100

const snapshot = devices
  .filter((device) => device.deviceName && device.pricing && Number.isFinite(device.pricing.monthlyInstallmentAmount))
  .map((device) => {
    const pricing = device.pricing
    const billCredit = round(pricing.recurringCreditAmount || 0)
    const monthlyAfterCredit = round(pricing.monthlyInstallmentAmount)
    return {
      id: device.externalId,
      name: device.deviceName,
      brand: device.manufacturer.charAt(0).toUpperCase() + device.manufacturer.slice(1),
      type: device.deviceType,
      condition: device.deviceCondition,
      storage: device.memory,
      fullPrice: round(pricing.regularAmount),
      termMonths: pricing.recurringChargePeriod,
      monthlyAfterCredit,
      billCreditMonthly: billCredit,
      monthlyBeforeCredit: round(monthlyAfterCredit + billCredit),
      saveAndReturnCredit: round(pricing.srCreditAmount || 0),
      priceTier: pricing.priceTier,
      availability: device.availabilityOptions,
      url: `https://www.rogers.com/phones/${device.urlSlug}`,
    }
  })

await mkdir(dirname(output), { recursive: true })
await writeFile(output, `${JSON.stringify({ source: sourcePage, capturedAt: new Date().toISOString().slice(0, 10), province: 'ON', devices: snapshot }, null, 2)}\n`)
console.log(`Saved ${snapshot.length} devices to ${output}`)
