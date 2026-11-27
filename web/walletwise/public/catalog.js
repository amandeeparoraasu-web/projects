import { merchantEntries } from './merchants.js';

export const categories = {
  dining: 'Dining', grocery: 'Groceries', gas: 'Gas', travel: 'Travel',
  wholesale: 'Wholesale clubs', drugstore: 'Drugstores', online: 'Online retail',
  streaming: 'Eligible streaming', transit: 'Transit', onlineGrocery: 'Online groceries',
  entertainment: 'Entertainment', portal: 'Chase Travel', costcoGas: 'Costco gas', walmart: 'Walmart purchases', other: 'Other purchases',
};

export const merchants = merchantEntries.map(([name, category, icon, keywords]) =>
  ({ name, category, icon, keywords }));

export const acceptedNetworks = merchant =>
  ['Costco', 'Costco Gas'].includes(merchant?.name) ? ['Visa'] : null;

const cash = { unit: 'cash', pointValue: 1 };
export const verifiedDate = '2026-11-27';
export const catalog = [
  { id: 'sapphire', name: 'Chase Sapphire Preferred', issuer: 'Chase', network: 'Visa', color: 'blue',
    unit: 'points', pointValue: 1, base: 1, rates: { dining: 3, gas: 3, streaming: 3, onlineGrocery: 3, travel: 2, portal: 5 },
    source: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred' },
  { id: 'unlimited', name: 'Chase Freedom Unlimited', issuer: 'Chase', network: 'Visa', color: 'violet',
    ...cash, base: 1.5, rates: { dining: 3, drugstore: 3, portal: 5 },
    source: 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited' },
  { id: 'flex', name: 'Chase Freedom Flex', issuer: 'Chase', network: 'Mastercard', color: 'violet',
    ...cash, base: 1, rates: { dining: 3, drugstore: 3, portal: 5 },
    source: 'https://creditcards.chase.com/cash-back-credit-cards/freedom/flex' },
  { id: 'everyday', name: 'Amex Blue Cash Everyday', issuer: 'American Express', network: 'Amex', color: 'cyan',
    ...cash, base: 1, rates: { grocery: 3, gas: 3, online: 3 },
    groups: { grocery: 'grocery', gas: 'gas', online: 'online' },
    caps: { grocery: 6000, gas: 6000, online: 6000 },
    source: 'https://global.americanexpress.com/card-benefits/detail/blue-cash-everyday-321/blue-cash-everyday/' },
  { id: 'preferred', name: 'Amex Blue Cash Preferred', issuer: 'American Express', network: 'Amex', color: 'blue',
    ...cash, base: 1, rates: { grocery: 6, streaming: 6, gas: 3, transit: 3 }, annualFee: 95,
    groups: { grocery: 'grocery' }, caps: { grocery: 6000 },
    source: 'https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/' },
  { id: 'double', name: 'Citi Double Cash', issuer: 'Citi', network: 'Mastercard', color: 'mint',
    ...cash, base: 2, rates: {},
    source: 'https://www.citi.com/credit-cards/citi-double-cash-credit-card' },
  { id: 'onepay', name: 'OnePay CashRewards Mastercard', issuer: 'OnePay', network: 'Mastercard', color: 'mint',
    ...cash, base: 1.5, rates: { walmart: 3 }, annualFee: 0,
    memberBonus: { category: 'walmart', rate: 5, requirement: 'linked Walmart+ membership' },
    source: 'https://www.onepay.com/credit-card' },
  { id: 'costco', name: 'Costco Anywhere Visa', issuer: 'Citi', network: 'Visa', color: 'orange',
    ...cash, base: 1, rates: { gas: 4, costcoGas: 5, wholesale: 2, dining: 3, travel: 3 },
    groups: { gas: 'fuel', costcoGas: 'fuel' }, caps: { fuel: 7000 },
    source: 'https://www.citi.com/credit-cards/costco-anywhere-visa-card' },
];

export function mergeMarket(cards) {
  const normalize = name => name.toLowerCase().replace(/[^a-z0-9 ]/g, '')
    .replace(/^amex |^american express |^chase |^citi | credit card$| card$| card by citi$/g, '')
    .replaceAll(' ', '');
  const known = new Set(catalog.map(card => normalize(card.name)));
  for (const card of cards) {
    const normalized = normalize(card.name);
    if (known.has(normalized)) continue;
    catalog.push(card);
    known.add(normalized);
  }
}
