import { writeFile, rename } from 'node:fs/promises';

const key = process.env.CARDAPI_KEY;
if (!key) throw new Error('Set CARDAPI_KEY in the build environment.');

const networks = { VISA: 'Visa', MC: 'Mastercard', AMEX: 'Amex', DISCOVER: 'Discover' };
const categories = {
  dining: 'dining', groceries: 'grocery', gas: 'gas', travel: 'travel',
  drugstore: 'drugstore', 'online-shopping': 'online', 'online-grocery': 'onlineGrocery',
  'wholesale-clubs': 'wholesale', streaming: 'streaming', transit: 'transit', entertainment: 'entertainment',
};

function normalize(card) {
  const rows = card.reward_rates ?? [];
  const unrestricted = rows.filter(row => !row.merchant && !row.booking_channel && !row.choice_group &&
    !row.is_rotating && !row.cap_amount && !row.excluded_merchants?.length && !row.excluded_categories?.length &&
    Number.isFinite(row.rate_multiplier));
  const base = unrestricted.find(row => row.is_base_rate || row.category_slug === 'other');
  // Cash-only entries avoid assigning a misleading valuation to an unfamiliar points currency.
  if (!base || base.rate_type !== 'percent_cashback') return null;
  if (!networks[card.network] || !card.slug || !card.name) return null;
  const rates = {};
  for (const row of unrestricted) {
    if (row.rate_type !== base.rate_type) continue;
    for (const category of row.categories ?? []) {
      const name = categories[category];
      if (name) rates[name] = Math.max(rates[name] ?? 0, row.rate_multiplier);
    }
  }
  return {
    id: `market-${card.slug}`, name: card.name, issuer: card.issuers?.name ?? '',
    network: networks[card.network], color: 'mint', unit: 'cash', pointValue: 1,
    base: base.rate_multiplier, rates, annualFee: card.annual_fee,
  };
}

const cards = [];
for (let offset = 0; ; offset += 100) {
  const response = await fetch(`https://api.cardapi.dev/v1/cards?country=US&type=personal&limit=100&offset=${offset}`, {
    headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error(`CardAPI returned HTTP ${response.status}`);
  const page = await response.json();
  if (!Array.isArray(page.data)) throw new Error('Unexpected CardAPI response.');
  cards.push(...page.data.filter(card => !card.is_discontinued).map(normalize).filter(Boolean));
  if (page.data.length < 100 || offset + 100 >= page.total) break;
}
if (!cards.length) throw new Error('CardAPI returned no supported cards with a usable base rate.');
const output = new URL('../public/market.json', import.meta.url);
const temporary = new URL('../public/market.json.tmp', import.meta.url);
await writeFile(temporary, JSON.stringify({ syncedAt: new Date().toISOString(), cards }));
await rename(temporary, output);
console.log(`Synced ${cards.length} supported U.S. cash-back offers.`);
