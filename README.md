This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# buildrstudio

## BothSide product pages

- `/products/both-side`: responsive creator marketing page, graphite/ivory theme and optimized native UI renders.
- `/products/both-side/privacy`: app-specific local-data/permission policy, with website analytics distinguished.
- `/products/both-side/help`: FAQs and existing BuildrStudio email support. `/products/both-side/support` redirects here.

Included in the company portfolio and sitemap. No public App Store URL is confirmed: availability reads “Coming to iPhone”. Assets use fictional sample media from the BothSide 1.0.0 marketing kit; the app icon is the current shipping asset. No deployment is implied.

Validation (November 9, 2026): `bun run lint` and `bun run build` passed. Local production preview reviewed at 1280px desktop and 390px mobile; no horizontal overflow observed. Native help accordion expands, privacy navigation works, support redirects to help. Canonical metadata points to buildrstudio.in. No deployment or App Store availability claim.

BothSide monetization copy now describes three free saved camera takes and a one-time unlimited-recording Full Unlock. No subscription, watermark or existing-video access gate. Availability remains coming soon; App Store Connect product setup and sandbox verification are pending.
