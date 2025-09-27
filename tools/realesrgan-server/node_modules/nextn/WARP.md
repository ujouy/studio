# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Luxury streetwear e-commerce (Streetwear AI) built with Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui
- AI-assisted product design via Genkit and Google AI models; users create and refine graphics, previewed on high-quality mockups
- Tests are not configured in this repo

Product vision & UX (per spec)
- AI Design Creation: Free-form prompt with selectable Style Modifiers and optional negative prompts
- Real-Time Customization & Preview: Switch product (t-shirt/hoodie/hat), select colors, and see price update alongside the mockup
- Creator Dashboard: Save designs and view order history with real-time status and tracking
- Seamless E-commerce: Shopping cart and secure checkout with modern payment gateways

Common commands
- Install dependencies: npm install
- Run dev server (Turbopack on port 9002): npm run dev
  - App will be available at http://localhost:9002
- Build production bundle: npm run build
- Start production server: npm run start
- Lint: npm run lint
- Typecheck: npm run typecheck
- Genkit dev UI (for working on flows locally):
  - Start: npm run genkit:dev
  - Watch mode: npm run genkit:watch
- Tests: none configured (no test scripts present)

High-level architecture
- App entry and layout
  - src/app/layout.tsx: Root layout. Applies global styles, injects fonts, wraps the app with AuthProvider, renders Header and Toaster
  - src/app/page.tsx: Home page. Renders GraphicGenerator

- Server actions (form-driven server-side logic)
  - src/app/actions.ts:
    - handleGenerate(formData) -> calls generateStreetwearGraphic flow; returns { image (data URI), error, prompt }
    - handleIterate(formData) -> calls iterateStreetwearGraphic flow; returns { refined image (data URI), error, prompt }
    - Zod validation ensures prompts/feedback are non-trivial before invoking flows

- AI flows (Genkit)
  - src/ai/genkit.ts: Genkit configured with googleAI() plugin; default text model set to googleai/gemini-2.5-flash
  - src/ai/flows/generate-streetwear-graphic.ts:
    - defineFlow that calls ai.generate with model googleai/imagen-4.0-fast-generate-001 using the user prompt (+ optional negativePrompt) to produce an image (as a data URI)
  - src/ai/flows/iterate-streetwear-graphic.ts:
    - First uses ai.generate (Gemini) with the previous image + user feedback to synthesize a new descriptive prompt
    - Then calls ai.generate (Imagen) with that new prompt (+ optional negativePrompt) to produce the refined image
  - src/ai/dev.ts: Loads both flows for local development via genkit start
  - Note: Provider credentials are required for Genkit to access Google AI; set up credentials in your environment before using the flows

- UI and state management
  - src/components/graphic-generator.tsx (client component):
    - Collects a base prompt + optional negative prompt; provides curated style modifiers
    - Submits forms via React’s useActionState to the server actions above
    - On success, shows the generated/refined image; provides UI to iterate, scale, and offset the design
  - src/components/product-preview.tsx: Overlays the generated image within a defined print area on a chosen product mockup; supports scale/offset transforms
  - src/lib/product-types.ts: Catalog of products (t-shirt, hoodie, hat) with variants, mockup URLs, prices, and print-area rectangles used by ProductPreview
  - src/components/header.tsx, src/components/auth-forms.tsx: Navigation and mock login/sign-up UI
  - src/context/auth-provider.tsx and src/hooks/use-auth.ts: In-memory auth stub for demo purposes (email-only); used to gate /dashboard

- Styling and config
  - Tailwind setup:
    - tailwind.config.ts: content globs and theme tokens (CSS variables)
    - src/app/globals.css: design tokens (HSL variables) and base styles; includes a grid-pattern background utility
    - postcss.config.mjs: loads Tailwind
  - Next config (next.config.ts):
    - typescript.ignoreBuildErrors: true and eslint.ignoreDuringBuilds: true (builds won’t fail on type or lint errors)
    - images.remotePatterns allow external image hosts; local product mockups are referenced from /images/mockups

Platform workflow (serverless automation, per spec)
- Design Generation: Frontend submits prompt to a Firebase Function that calls Google Gemini/Imagen; the final graphic is returned and stored
- Permanent Storage: Generated images are saved to Firebase Storage (private, durable)
- Order Placement: On successful checkout, create an order document in Firestore containing shipping info and a link to the design file in Storage
- Automated Fulfillment: A Firestore-triggered Firebase Function sends the order to Printful (product + variant + design URL)
- Printing & Shipping: Printful prints, packages, and ships; Printful webhooks post back shipping/tracking events
- Status Updates: A webhook-handling Firebase Function updates the Firestore order document so the user’s dashboard reflects real-time status

Assets
- Product mockup images are referenced from /images/mockups (e.g., /images/mockups/blackshirt.webp). Ensure these exist under public/images/mockups in this repo or update src/lib/product-types.ts accordingly

Notes and current status
- Dev server port is 9002 (npm run dev)
- For Genkit flow development, it’s typical to run both the app (npm run dev) and the Genkit runner (npm run genkit:dev or :watch) in parallel
- The Firebase Functions, Firestore, Printful integration, and webhooks described in the platform spec are not present in this repository; if they exist externally, set the necessary environment variables and endpoints to connect; otherwise, implement them (Firebase project, Functions, Storage rules, Firestore schemas, Printful API keys, webhook receiver URLs)
