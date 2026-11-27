import assert from 'node:assert/strict';
import test from 'node:test';
import { catalog, merchants } from '../public/catalog.js';
import { bestMarketCashBack, currentQuarter, estimate, recommendations } from '../public/rewards.js';

const card = id => catalog.find(entry => entry.id === id);
const merchant = name => merchants.find(entry => entry.name === name);

test('points valuation can change the best card', () => {
  const sapphire = { ...card('sapphire'), pointValue: 1.5 };
  const result = recommendations([sapphire, card('unlimited')], 'dining', 100);
  assert.equal(result.best.card.id, 'sapphire');
  assert.equal(result.best.units, 300);
  assert.equal(result.best.value, 4.5);
});
test('opportunity cost excludes owned and inactive wallet cards', () => {
  const result = recommendations([card('unlimited'), { ...card('costco'), id: 'owned', productId: 'costco', active: false }], 'gas', 100);
  assert.equal(result.best.card.id, 'unlimited');
  assert.equal(result.alternative.value, 3);
  assert.equal(result.difference, 1.5);
});
test('U.S. Costco check-ins only rank Visa credit cards', () => {
  const result = recommendations([card('double'), card('sapphire')], 'wholesale', 100, merchant('Costco'));
  assert.equal(result.ranked.length, 1);
  assert.equal(result.alternative.card.id, 'costco');
  assert.equal(estimate(card('costco'), 'wholesale', 100).value, 1);
});
test('annual bonus spend splits over cap and resets for the next year', () => {
  const everyday = { ...card('everyday'), spendYear: 2026, spent: { gas: 5990 } };
  assert.equal(estimate(everyday, 'gas', 30, null, new Date(2026, 4, 10)).value, 0.5);
  assert.equal(estimate(everyday, 'gas', 30, null, new Date(2027, 0, 1)).value, 0.9);
});
test('rotation respects activation, category, remaining spend and quarter', () => {
  const date = new Date(2026, 11, 5);
  const rotation = { enabled: true, quarter: currentQuarter(date), category: 'grocery', rate: 5, remaining: 50 };
  const flex = { ...card('flex'), rotation };
  assert.equal(estimate(flex, 'grocery', 100, null, date).value, 3);
  assert.equal(estimate(flex, 'grocery', 100, null, new Date(2027, 0, 1)).value, 1);
  assert.equal(estimate(flex, 'gas', 100, null, date).value, 1);
  assert.equal(estimate({ ...flex, rotation: { ...rotation, enabled: false } }, 'grocery', 100, null, date).value, 1);
});
test('empty wallet, invalid inputs and ties do not show missed rewards', () => {
  assert.equal(recommendations([], 'dining', 100).best, null);
  assert.equal(recommendations([card('sapphire')], 'dining', NaN).best, null);
  assert.equal(recommendations([card('sapphire')], 'dining', 100).alternative, null);
});

test('market cash back works with an empty wallet and respects Walmart eligibility', () => {
  const walmart = merchant('Walmart');
  const winner = bestMarketCashBack(walmart.category, 125, walmart);
  assert.equal(winner.card.id, 'onepay');
  assert.equal(winner.value, 3.75);
  assert.equal(winner.card.memberBonus.rate, 5);
  assert.equal(estimate(winner.card, 'other', 100).value, 1.5);
});
