export type Offer = {
  id: string
  eyebrow: string
  title: string
  description: string
  price: string
  priceNote: string
  tag: string
  category: 'mobile' | 'internet' | 'devices' | 'tv' | 'home'
  tone: string
}

export type FeaturePromotion = {
  id: string
  eyebrow: string
  title: string
  description: string
  action: string
  category: Offer['category']
}

export type MobilePlan = {
  id: string
  name: string
  data: string
  bundlePrice: number
  mobileOnlyPrice: number
  priceBeforeIncentives: number
  features: string[]
  perks: string[]
  mixAndMatch: boolean
  badge?: string
}

export type PhoneProduct = {
  name: string
  line: 'Apple' | 'Samsung' | 'Google'
  swatch: string
  badge?: string
  monthlyPrice?: string
  priceNote?: string
  details?: string[]
}

export const homeSecurityOffer = {
  name: 'Rogers Xfinity Self Protection',
  startingPrice: 15,
  priceCadence: '/mo.',
  priceNote: 'Add to an Internet plan from $15/month for 36 months, or bundle with TV.',
  benefits: [
    '24/7 Continuous Video Recording',
    '7-day cloud storage',
    'Smart home device control',
    'Network Advanced Security',
  ],
  features: [
    { title: 'Control it all with one app', description: 'Lock doors remotely and manage security cameras, your WiFi network and compatible smart devices in the Rogers Xfinity app.', art: 'app' },
    { title: 'Answer your door from anywhere', description: 'Get notified when someone is at your door and use two-way audio to chat, even when you are away.', art: 'door' },
    { title: 'Don’t miss a thing', description: 'Check in from anywhere with live video, two-way audio and cloud recordings from your camera.', art: 'camera' },
    { title: 'Protect your home with smart sensors', description: 'Get notifications about movement, doors and windows opening, or a possible basement flood.', art: 'sensors' },
    { title: 'Connect your home', description: 'Bundle Rogers Xfinity TV to watch live feeds and recordings right on your TV.', art: 'tv' },
  ] as const,
}

export const bankCards = [
  {
    id: 'red',
    name: 'Rogers Red Mastercard',
    tier: 'No annual fee',
    headline: 'Up to 3% cash back value',
    cashBack: 'Up to 3%',
    usd: '2% cash back on USD purchases',
    qualification: 'Subject to credit assessment',
    insurance: 'No included insurance',
    style: 'red',
  },
  {
    id: 'world',
    name: 'Rogers Red World Mastercard',
    tier: 'No annual fee',
    headline: 'More rewards for everyday spending',
    cashBack: 'Up to 3%',
    usd: '2% cash back on USD purchases',
    qualification: 'Subject to credit assessment and income verification. Minimum annual income requirement of $50,000 personal or $80,000 household.',
    insurance: 'Purchase Protection and Extended Warranty Insurance',
    style: 'world',
  },
  {
    id: 'elite',
    name: 'Rogers Red World Elite Mastercard',
    tier: 'No annual fee',
    headline: 'Rewards with a little more included',
    cashBack: 'Up to 3%',
    usd: '3% cash back on USD purchases',
    qualification: 'Subject to credit assessment and income verification. Minimum annual income requirement of $80,000 personal or $150,000 household.',
    insurance: 'Purchase Protection, Extended Warranty, Car Rental Collision and Loss Damage, Emergency Travel Medical, and Trip Cancellation & Trip Interruption Insurance',
    style: 'elite',
  },
  {
    id: 'business',
    name: 'Rogers Red World Elite Business Mastercard',
    tier: 'For your business',
    headline: 'More for your business spending',
    cashBack: 'Cash back rewards',
    usd: 'Business card benefits',
    qualification: 'For eligible business applicants; subject to credit assessment.',
    insurance: 'See card details for included insurance and eligibility.',
    style: 'business',
  },
] as const

export const offerSnapshotDate = 'October 3, 2026'

export const offers: Offer[] = [
  {
    id: 'infinite',
    eyebrow: 'ROGERS INFINITE',
    title: 'More of what you love.',
    description: 'Get unlimited data with no overage fees, plus 5G+ speed on Canada’s reliable network.',
    price: '$50',
    priceNote: '/mo. with Internet or TV and Auto-Pay',
    tag: 'Limited-time offer',
    category: 'mobile',
    tone: 'pink',
  },
  {
    id: 'ignite',
    eyebrow: 'ROGERS XFINITY INTERNET',
    title: 'Make room for more.',
    description: 'Power your whole home with fast, reliable internet and WiFi that goes further.',
    price: '$60',
    priceNote: '/mo. for 24 months',
    tag: 'Popular choice',
    category: 'internet',
    tone: 'violet',
  },
  {
    id: 'iphone',
    eyebrow: 'NEW & NOTEWORTHY',
    title: 'A little more you.',
    description: 'Discover the latest phones, with flexible financing and great trade-in value.',
    price: '$0',
    priceNote: 'down on select phones',
    tag: 'Shop new devices',
    category: 'devices',
    tone: 'blue',
  },
  {
    id: 'bundle',
    eyebrow: 'MORE TO LOVE',
    title: 'Bring it all together.',
    description: 'Bundle mobile and home services for a better-connected everyday.',
    price: 'Save',
    priceNote: 'when you bundle',
    tag: 'Bundle & save',
    category: 'tv',
    tone: 'orange',
  },
]

export const featuredPromotions: FeaturePromotion[] = [
  {
    id: 'sportsnet-plus',
    eyebrow: 'ROGERS XFINITY SPORTSNET',
    title: 'Get 150+ more NHL games with Sportsnet+',
    description: 'Sportsnet+ exclusive content now included for Rogers Xfinity Sportsnet subscribers.',
    action: 'Shop TV bundles',
    category: 'tv',
  },
]

export const catalog = {
  mobile: {
    title: 'Mobile plans',
    description: '5G+ plans with room for what matters.',
    detail: 'Compare 5G+ Essentials, Popular, Ultimate and Lite plans, with flexible options for bringing your own phone.',
    features: ['5G+ network access', 'Unlimited Canada-wide talk and text', 'Plan options for travel'],
    price: '$50',
    cadence: '/mo. with Internet or TV and Auto-Pay',
    label: '5G+ Lite',
  },
  internet: {
    title: 'Internet that keeps up',
    description: 'A connection for everything life brings.',
    detail: 'Stream, game and video call with fast, reliable internet and WiFi coverage throughout your home.',
    features: ['Fast, reliable speeds', 'Whole-home WiFi options', '24/7 online support'],
    price: '$60',
    cadence: '/mo. for 24 months',
    label: 'Ignite Internet 500',
  },
  tv: {
    title: 'TV, on your terms',
    description: 'The shows you love, all in one place.',
    detail: 'Find live TV, on-demand favourites and your go-to streaming apps in one easy experience.',
    features: ['Flexible channel packs', 'Stream on your devices', 'Voice remote included'],
    price: '$25',
    cadence: '/mo.',
    label: 'Ignite TV Starter',
  },
  smartHome: {
    title: 'A smarter kind of home',
    description: 'Feel more connected to the place you love.',
    detail: 'Keep an eye on what matters with connected cameras, smart sensors and home monitoring.',
    features: ['24/7 professional monitoring options', 'Smart home controls', 'Manage it all in one app'],
    price: '$25',
    cadence: '/mo.',
    label: 'Connected Home',
  },
  homePhone: {
    title: 'A home phone that feels like home',
    description: 'Keep in touch with the people who matter.',
    detail: 'Enjoy dependable home phone service with the calling features you use every day.',
    features: ['Unlimited Canada-wide calling', 'Call display and voicemail', 'Easy to set up'],
    price: '$10',
    cadence: '/mo.',
    label: 'Rogers Home Phone',
  },
}

export const mobilePlans: MobilePlan[] = [
  {
    id: 'essentials',
    name: '5G+ Essentials',
    data: '100 GB high-speed data',
    bundlePrice: 55,
    mobileOnlyPrice: 70,
    priceBeforeIncentives: 85,
    features: [
      '5G+ speeds up to 2 Gbps',
      'Unlimited data at reduced speeds thereafter',
      'Data, talk and text in the US for 24 months',
    ],
    perks: ['Save up to 25% on streaming subscriptions with StreamSaver', 'Rogers Satellite included'],
    mixAndMatch: true,
  },
  {
    id: 'popular',
    name: '5G+ Popular',
    data: 'Unlimited high-speed data',
    bundlePrice: 70,
    mobileOnlyPrice: 85,
    priceBeforeIncentives: 100,
    features: [
      '5G+ speeds up to 2 Gbps',
      'Data, talk and text in the US, Mexico and Caribbean for 24 months',
      'Unlimited calling to 27 countries',
    ],
    perks: ['$0/mo. Uber One for the first 12 months', 'Save up to 25% on streaming subscriptions with StreamSaver', 'Rogers Satellite included'],
    mixAndMatch: true,
    badge: '5-year price guarantee',
  },
  {
    id: 'ultimate',
    name: '5G+ Ultimate',
    data: 'Unlimited high-speed data',
    bundlePrice: 85,
    mobileOnlyPrice: 100,
    priceBeforeIncentives: 115,
    features: [
      '5G+ speeds up to 2 Gbps',
      'Data, talk and text in 64 destinations',
      'Unlimited calling to 27 countries',
      'Priority network access',
    ],
    perks: ['$0/mo. Uber One for the first 12 months', 'Save up to 25% on streaming subscriptions with StreamSaver', 'Rogers Satellite included'],
    mixAndMatch: true,
  },
  {
    id: 'lite',
    name: '5G+ Lite',
    data: '60 GB high-speed data',
    bundlePrice: 50,
    mobileOnlyPrice: 65,
    priceBeforeIncentives: 80,
    features: [
      '5G+ speeds up to 2 Gbps',
      'Unlimited data at reduced speeds thereafter',
      'Data, talk and text in Canada',
    ],
    perks: ['Save up to 25% on streaming subscriptions with StreamSaver', 'Rogers Satellite included'],
    mixAndMatch: false,
  },
]

export const additionalLinePrices = {
  essentials: [55, 45, 35],
  popular: [70, 60, 50],
  ultimate: [85, 75, 65],
}

export const productCards: PhoneProduct[] = [
  { name: 'iPhone 18 Pro Max', line: 'Apple', swatch: 'phone-purple', badge: 'Popular' },
  {
    name: 'iPhone 18 Pro',
    line: 'Apple',
    swatch: 'phone-purple',
    badge: 'Featured',
    monthlyPrice: '$37.47/mo.',
    priceNote: '24 mos. at 0% APR with Save & Return and a Popular plan · $0 down',
    details: ['256 GB, 512 GB, 1 TB or 2 TB', 'eSIM only', 'Full price: $1,799.28'],
  },
  { name: 'iPhone 17 Pro Max', line: 'Apple', swatch: 'phone-silver' },
  { name: 'iPhone 17 Pro', line: 'Apple', swatch: 'phone-purple' },
  { name: 'iPhone 17', line: 'Apple', swatch: 'phone-green' },
  { name: 'Galaxy S26 Ultra', line: 'Samsung', swatch: 'phone-silver' },
  { name: 'Galaxy S26 Plus', line: 'Samsung', swatch: 'phone-purple' },
  { name: 'Galaxy S26', line: 'Samsung', swatch: 'phone-green' },
  { name: 'Pixel 11', line: 'Google', swatch: 'phone-green' },
]
