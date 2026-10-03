# Rogers consumer experience

A responsive React and TypeScript consumer storefront built with Vite. The UI is backed by a small, replaceable offers catalog (`src/services/offers.ts`) and a text-assistant service (`src/services/assistant.ts`). Promotional content and pricing can be moved to a live feed without coupling the pages to its transport.

## Run locally

```sh
npm install
npm run dev
```

Vite serves the storefront. When the Static Web Apps `/api/chat` endpoint is not available locally, Anna uses the built-in demo responder. Run with the Azure Static Web Apps CLI to exercise the Functions API locally.

## Azure Static Web Apps and Anna

Deploy the repository as the Static Web Apps app and set its API location to `api`. The `api/chat` HTTP-triggered Function calls an Azure OpenAI chat-completions deployment when configured; otherwise, it returns the deterministic demo response. Set these application settings in the Static Web Apps resource (see `.env.example`):

- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_DEPLOYMENT` (for example, a deployment named `gpt-4.1-mini`)
- `AZURE_OPENAI_API_VERSION`
- `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` (reserved for future speech support)

Keep credentials out of frontend build-time variables. The browser only calls `/api/chat`, so Azure OpenAI secrets stay in the server-side Function configuration. The Anna client and capability flags are separated so speech, uploads, video and live support can be added without changing the chat surface.

## Build

```sh
npm run build
```

The static site is emitted to `dist`, suitable for Azure Static Web Apps.

## Anna conversation flow

Anna retains the chat transcript, customer profile, completed journey questions and current stage in app state while the chat session is open, including when the panel is closed and reopened. The mobile-plan journey collects line count and data use, mobile provider, device ownership and age, common phone use, travel frequency and destinations, home Internet/TV providers, bundling interest and budget preference. Each answer is saved against its stage before Anna advances; a completed stage is not asked again, and explicit corrections update the profile. Console logs show the current stage for debugging. Typical data-use, phone-activity and roaming-destination quick replies are available during the relevant stages. The API receives the recent conversation and known profile values so the Azure OpenAI experience can continue with the same context.

When Anna provides a plan recommendation, **Add this plan to cart** transfers the recommended plan, line count, data allowance and estimated monthly price into the storefront cart and checkout summary. Checkout is a frontend demo and does not place a real Rogers order.

The **Device Upgrade Journey** walkthrough and upgrade requests in chat launch a dedicated guided flow. Anna asks about the current phone brand, upgrade priorities and comfortable monthly budget, then recommends a matching phone from the device catalog. The recommendation can be added directly to the cart or opened in the phone catalog. Only catalog-listed financing prices are carried as estimates; otherwise the cart and checkout clearly mark device pricing as to be confirmed. Checkout remains a non-purchasing demo.

The other Executive Demo tiles (customer care, personalized offers, roaming, technical support, compare with competitors and multimodal care) each launch their own three-step guided flow with clickable choices, saved answers, and an explicit completion summary. These demos do not depend on Azure OpenAI availability.

## Anna Internet and home-service troubleshooting

Common outage, slow Internet, WiFi coverage, TV/streaming, device connectivity and smart-home reports automatically open a session-persistent troubleshooting journey. Anna stores the reported issue, room, symptom, simulated diagnostic results, tried steps and customer responses. The staged flow identifies the issue, shows a simulated network/gateway/WiFi/streaming/device check, presents a likely cause and walks through one resolution step at a time. Customers can confirm resolution or continue to technician, WiFi Pods, specialist or advanced-diagnostic options. Bedroom WiFi coverage includes an illustrative 74% to 96% WiFi Pods projection. Diagnostics and escalation actions are demonstrations only; no live network test, appointment, transfer or order is initiated.

The Anna panel includes a **Demo Walkthrough** that runs the poor-bedroom-WiFi scenario from report through simulated diagnosis, WiFi Pods recommendation and resolved outcome. Modem photos, error screenshots, video and voice are shown as disabled future-capability placeholders.

## Offer, device, security, card and company pages

Mobile plans, phone catalog entries, Home Security features and Rogers Bank card summaries are stored in `src/services/offers.ts` so future product feeds can replace the reference data without changing page components. The home page’s MLSE “Learn more” action opens the in-app About Rogers landing page. Pricing, financing and card benefits reflect public information captured on October 3, 2026; they are not live offers. Confirm current pricing, eligibility and terms with Rogers or Rogers Bank.
