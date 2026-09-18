# PandaHat Web

The application and its npm package are in `web/`.

```sh
cd web
npm ci
npm run dev
```

Use Node.js 24 (`nvm use` from the repository root). For a production readiness check:

```sh
cd web
npx playwright install chromium
npm run check
```

See [the app README](web/README.md) for content editing and [deployment preparation](web/DEPLOYMENT.md) for build output, hosting settings, and remaining launch decisions.
