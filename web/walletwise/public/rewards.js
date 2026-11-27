import { acceptedNetworks, catalog } from './catalog.js';

export function currentQuarter(date = new Date()) {
  return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
}

export function estimate(card, category, amount, merchant, date = new Date()) {
  if (card.active === false || !Number.isFinite(amount) || amount <= 0) return null;
  const networks = acceptedNetworks(merchant);
  if (networks && !networks.includes(card.network)) return null;
  const { base, rates, rotation } = card;
  let rate = rates[category] ?? base;
  if (category === 'wholesale' && (card.productId ?? card.id) === 'costco' && merchant?.name !== 'Costco') {
    rate = base;
  }
  const group = card.groups?.[category];
  const spent = card.spendYear === date.getFullYear() ? card.spent?.[group] ?? 0 : 0;
  const remaining = group ? Math.max(0, card.caps[group] - spent) : amount;
  const limited = Math.min(amount, remaining);
  const standard = limited * rate + (amount - limited) * base;
  let earned = standard;
  const comparableCategory = category === 'costcoGas' ? 'gas' : category;
  if (rotation?.enabled && rotation.quarter === currentQuarter(date) &&
    (rotation.category === category || rotation.category === comparableCategory)) {
    const bonusAmount = Math.min(amount, Math.max(0, rotation.remaining));
    const gainDuringBonus = Math.min(bonusAmount, limited) * Math.max(0, rotation.rate - rate);
    const gainAfterCap = Math.max(0, bonusAmount - limited) * Math.max(0, rotation.rate - base);
    earned += gainDuringBonus + gainAfterCap;
  }
  const units = earned / (card.unit === 'cash' ? 100 : 1);
  const value = earned * (card.unit === 'points' ? card.pointValue : 1) / 100;
  return { card, units, value, rate: earned / amount, effective: value / amount * 100 };
}

export function bestMarketCashBack(category, amount, merchant, date = new Date()) {
  return catalog.filter(card => card.unit === 'cash')
    .map(card => estimate(card, category, amount, merchant, date)).filter(Boolean)
    .sort((a, b) => b.value - a.value || a.card.name.localeCompare(b.card.name))[0] ?? null;
}

export function recommendations(wallet, category, amount, merchant, date = new Date()) {
  const rank = cards => cards.map(card => estimate(card, category, amount, merchant, date))
    .filter(Boolean).sort((a, b) => b.value - a.value || a.card.name.localeCompare(b.card.name));
  const ranked = rank(wallet);
  const owned = new Set(wallet.map(card => card.productId ?? card.id));
  const best = ranked[0] ?? null;
  const potential = rank(catalog.filter(card => !owned.has(card.id)))[0];
  const difference = best && potential ? potential.value - best.value : 0;
  return { best, ranked, alternative: difference >= 0.005 ? potential : null, difference };
}
