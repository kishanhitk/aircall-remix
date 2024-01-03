# Aircall Submission by Kishan

[Live Deploy URL](https://aircall-remix.pages.dev/)

## Features
- List of all non-archived activities. Grouped by date.
- List of all archived activities. Grouped by date.
- Individual Activity Detail Page
- Archieve all activities at once
- Unarchieve all archived at once
- Archieve/Unarchieve individual activity
- Clean, Minimalistic UI
- Server Rendered
- Utilises Pre-Fetching for faster navigation
- Route Level Error Boundary
- Smooth View Transition
- Notifications by `react-hot-toast`
- Deployed on Cloudflare Edge
- Responsive Design
- Perfect 100 Lighthouse Score
## Development

You will be utilizing Wrangler for local development to emulate the Cloudflare runtime. This is already wired up in your package.json as the `dev` script:

```sh
# start the remix dev server and wrangler
npm run dev
```

Open up [http://127.0.0.1:8788](http://127.0.0.1:8788) and you should be ready to go!

## Deployment

Cloudflare Pages are currently only deployable through their Git provider integrations.

If you don't already have an account, then [create a Cloudflare account here](https://dash.cloudflare.com/sign-up/pages) and after verifying your email address with Cloudflare, go to your dashboard and follow the [Cloudflare Pages deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything).

Configure the "Build command" should be set to `npm run build`, and the "Build output directory" should be set to `public`.
