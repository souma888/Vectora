# Deploy Vectora to Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import `souma888/Vectora`.
3. Select the Vite framework preset.
4. Use build command `npm run build` and output directory `dist` (already described in `vercel.json`).
5. Deploy. Every push to the connected production branch can trigger a new deployment.
6. For a custom domain, configure it in Vercel project settings.

## Local verification

```bash
npm install
npm run dev
npm run build
npm run preview
```

The current frontend is static and does not require environment variables. If an API is added later, document its public base URL and CORS policy. Never put private credentials in a Vite client variable.


## Numerical API

The Applications page defaults to `https://numpy-matrix-api.onrender.com`. Set `VITE_MATRIX_API_URL` in Vercel if the backend has another base URL, then redeploy. Configure backend `CORS_ORIGINS` to include the exact production Vectora origin and local development origins. The API's default allowlist includes the current Vectora Vercel domain and localhost Vite port.
