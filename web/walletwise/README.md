# WalletWise

WalletWise compares credit card rewards for a specific U.S. purchase. Add cards from the issuer-checked catalog or enter a custom card, choose a merchant or purchase category, and enter the purchase amount. The Best cash back panel compares eligible catalog cards even with an empty wallet and displays any applicable Walmart+ bonus. The app ranks active wallet cards by estimated dollar value and shows the additional reward from a higher-earning catalog card outside the wallet when available.

## Run locally

From the WalletWise project folder with Node.js 22 or later:

```sh
npm test
npm run dev
```

Open http://localhost:4173/. The project uses vanilla HTML, CSS, and JavaScript and has no npm runtime dependencies.

## Card data and market updates

The app starts with an empty wallet. The included catalog uses selected current U.S. issuer offers, with links to issuer terms in the card editor. Its verification date appears in the footer. For example, the catalog reflects Chase’s updated Sapphire Preferred gas rewards and separates online groceries from supermarket purchases. [Chase Sapphire Preferred rewards](https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred)

Merchant selection uses category estimates. Actual merchant coding, card eligibility, and points redemption depend on issuer terms. Annual fees appear when available and are excluded from the per-purchase comparison. Enter year-to-date spending for capped wallet categories and enter rotating offers after activating them with the issuer. The app calculates estimates without recording purchases or automatically deducting them from caps.

To refresh the optional market feed, set `CARDAPI_KEY` in your shell or hosting build environment. Keep the credential out of client files and source control.

```sh
npm run sync:market
npm run build
```

The sync reads current U.S. personal offers and writes a dated JSON snapshot for the app. It imports cash-back offers with an identifiable base rate and straightforward category rules. The issuer-checked entries cover selected points programs and capped or merchant-specific rules. CardAPI documents weekly issuer checks and limits its free key to the top three rates per card, so a feed may omit lower rates or the base rate. Use a plan with full reward rows for broader coverage. A successful refresh date appears in the footer. Saved cards retain their account-specific terms. [CardAPI reward rate documentation](https://cardapi.dev/docs/reward-rates)

## Deploy

### Vercel

From the project directory:

```sh
npm run deploy:vercel
```

Sign in and select or create the project when prompted. The committed configuration builds the app and serves `dist/`. For an automated feed refresh, set the secret in your deployment environment and run `npm run sync:market && npm run build` as the build command. [Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json)

### Netlify

```sh
npx netlify-cli login
npx netlify-cli link
npm run deploy:netlify
```

For a new site, run `npx netlify-cli sites:create` before linking. The repository can also be imported through Netlify with the included configuration. To include market updates in a manual deploy, run the sync command before deploying. [Netlify file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/)

### GitHub Pages

1. Put the WalletWise project at the root of its own GitHub repository.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. Push to `main` or run **Deploy WalletWise to GitHub Pages** from the Actions tab.
4. Optionally set the repository Actions secret `CARDAPI_KEY`. The workflow refreshes the feed on deploy and runs weekly.

The Actions deployment links to the live site. Relative asset paths support repository subpaths. [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Portfolio integration

Link to the deployed HTTPS URL or embed it and provide a stand-alone link for installation and device storage support.

```html
<a href="https://your-walletwise-site.example/">Open WalletWise</a>
<iframe
  src="https://your-walletwise-site.example/"
  title="WalletWise credit card rewards optimizer"
  style="width:100%;min-height:850px;border:0"
  loading="lazy">
</iframe>
```

Cross-site iframes can restrict or partition browser storage. Install from the stand-alone HTTPS site. On compatible Chromium browsers, use the Install app button or browser menu. In iOS Safari, use **Share → Add to Home Screen**. After the first successful load, the service worker serves the app and bundled market snapshot offline.

## Project layout

- `public/index.html`, `styles.css`, `app.js`, and `icons.js` provide the interface.
- `public/catalog.js` and `market.json` provide card data. `public/merchants.js` contains the U.S. merchant directory and search aliases. Unlisted merchants can be entered with a user-selected category.
- `public/rewards.js` calculates returns independently of the UI.
- `public/storage.js` persists wallet profiles and the theme. A backend can replace this boundary later. The app stores card profiles without requesting account numbers.
- `public/sw.js`, the manifest, and PNG icons support installation and offline use.
- `scripts/` contains the static build, preview server, and market sync.
- `test/` covers reward calculations.
- `vercel.json`, `netlify.toml`, and `.github/workflows/pages.yml` configure deployment.

The `dist/` output can also serve as a web asset directory for a future Capacitor wrapper. Native packaging and app store submissions are separate steps.
