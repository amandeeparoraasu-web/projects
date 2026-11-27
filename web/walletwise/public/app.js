import { acceptedNetworks, catalog, categories, merchants, mergeMarket, verifiedDate } from './catalog.js';
import { bestMarketCashBack, currentQuarter, recommendations } from './rewards.js';
import { readPreference, readWallet, savePreference, saveWallet } from './storage.js';
import { normalizeMerchant } from './merchants.js';
import { icon } from './icons.js';

const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format;
const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format;
const categoryOptions = Object.entries(categories);
const options = (entries, selected) => entries.map(([key, label]) =>
  `<option value="${escape(key)}"${key === selected ? ' selected' : ''}>${escape(label)}</option>`).join('');
const findCard = id => catalog.find(card => card.id === id);
let wallet = readWallet() ?? [];
$('#catalog-date').textContent = `Issuer-checked catalog · ${verifiedDate}`;
let merchant = merchants[2];
let matches = [];
let matchIndex = -1;
let editingId = null;
let installing = null;

const search = $('#search');
const suggestions = $('#suggestions');
const category = $('#category');
const amount = $('#amount');
const dialog = $('#editor');

document.querySelectorAll('[data-icon]').forEach(node => { node.innerHTML = icon(node.dataset.icon); });
category.innerHTML = options(categoryOptions, merchant.category);
search.value = merchant.name;

function notice(message) {
  const element = $('#notice');
  element.textContent = message;
  element.hidden = false;
  clearTimeout(notice.timer);
  notice.timer = setTimeout(() => { element.hidden = true; }, 4500);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $('#theme').innerHTML = icon(theme === 'dark' ? 'sun' : 'moon');
  $('#theme').setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  $('meta[name=theme-color]').content = theme === 'dark' ? '#101714' : '#f2f6f2';
}
applyTheme(readPreference('walletwise.theme', 'dark') === 'light' ? 'light' : 'dark');
$('#theme').onclick = () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  savePreference('walletwise.theme', theme);
};

const merchantLabel = () => merchant?.name ?? categories[category.value];
const formatRate = (rate, card) => `${number(rate)}${card.unit === 'points' ? '×' : '%'}`;
function cardGraphic(card, small = false) {
  const color = ['blue', 'violet', 'cyan', 'mint', 'orange'].includes(card.color) ? card.color : 'mint';
  return `<span class="credit-card ${color}${small ? ' mini' : ''}" aria-hidden="true"><span class="card-issuer">${escape(card.issuer)}</span><span class="chip"></span><span class="card-network">${escape(card.network)}</span></span>`;
}

function renderWallet() {
  const cards = wallet;
  $('#wallet-count').textContent = `${cards.length} ${cards.length === 1 ? 'card' : 'cards'} · ${cards.filter(card => card.active !== false).length} active`;
  $('#wallet-list').innerHTML = cards.map((card, index) => `
    <article class="wallet-item">
      ${cardGraphic(card, true)}
      <div class="wallet-item-text"><h3>${escape(card.name)}</h3><p>${card.active === false ? 'Inactive' : `${formatRate(card.base, card)} base · ${escape(card.network)}`}</p></div>
      <button type="button" class="icon-button edit" data-edit="${index}" aria-label="Edit ${escape(card.name)}">${icon('edit')}</button>
    </article>`).join('') || '<p class="empty-wallet">Add a card to see which one earns the most.</p>';
}

function renderMarket(amountValue) {
  const market = bestMarketCashBack(category.value, amountValue ?? 100, merchant);
  const result = $('#market-result');
  if (!market) {
    result.textContent = 'No eligible cash-back card in the catalog for this purchase.';
    return;
  }
  const { card, value, effective } = market;
  const bonus = card.memberBonus;
  const membership = bonus?.category === category.value
    ? `<p class="market-bonus"><strong>${number(bonus.rate)}% cash back</strong> with a ${escape(bonus.requirement)}${amountValue === null ? '' : ` · ${money(amountValue * bonus.rate / 100)} estimated`}.</p>`
    : '';
  result.innerHTML = `<article class="market-pick">
    <div class="market-context">${escape(merchantLabel())}</div>
    <h3>${escape(card.name)}</h3>
    <p><strong class="market-rate">${number(effective)}%</strong> cash back${amountValue === null ? '' : ` · ${money(value)} estimated`}</p>
    ${membership}
    ${card.source ? `<a href="${escape(card.source)}" target="_blank" rel="noopener noreferrer">View card terms</a>` : ''}
  </article>`;
}

function renderResults() {
  const target = $('#recommendation');
  const value = amount.valueAsNumber;
  const valid = amount.validity.valid && Number.isFinite(value);
  renderMarket(valid ? value : null);
  if (!valid) {
    target.innerHTML = '<p class="panel empty-result">Enter a purchase amount from $0.01 to $1,000,000 in whole cents.</p>';
    return;
  }
  const { best, ranked, alternative, difference } = recommendations(wallet, category.value, value, merchant);
  const network = acceptedNetworks(merchant)?.join(', ');
  if (!best) {
    target.innerHTML = `<p class="panel empty-result">${network ? `Add or activate a ${network} card for this merchant.` : 'Add or activate a card to get a recommendation.'}</p>`;
    return;
  }
  const { card, rate, units } = best;
  const earnText = card.unit === 'points' ? `${number(units)} points at ${number(card.pointValue)}¢ each` : 'Estimated cash back';
  const rankedRows = ranked.slice(1).map(entry =>
    `<li><span>${escape(entry.card.name)}</span><strong>${money(entry.value)}</strong></li>`).join('');
  target.innerHTML = `
    <article class="best">
      <div class="best-info"><span class="tag">${icon('check')} BEST IN YOUR WALLET</span>
      <h3>${escape(card.name)}</h3><p>${formatRate(rate, card)} on this purchase · ${escape(merchantLabel())}</p></div>
      <div class="best-money"><strong>${money(best.value)}</strong><span>${earnText}</span></div>
    </article>
    ${alternative ? `<article class="alternative"><span class="section-icon gold">${icon('trend')}</span>
      <div><span class="alt-label">OUTSIDE YOUR WALLET</span><h3>${escape(alternative.card.name)}</h3>
      <p>${number(alternative.effective)}% estimated return · ${money(alternative.value)} total${Number.isFinite(alternative.card.annualFee) ? ` · ${money(alternative.card.annualFee)} annual fee` : ''}</p></div>
      <div class="alt-money"><strong>+${money(difference)}</strong><span>potential extra</span></div></article>`
      : '<p class="matched">No other card in the catalog earns more on this purchase.</p>'}
    ${rankedRows ? `<details class="ranked"><summary>Compare other wallet cards</summary><ul>${rankedRows}</ul></details>` : ''}
    ${network ? `<p class="matched">Credit cards accepted for this check-in: ${network}.</p>` : ''}`;
}

function renderQuick() {
  const quick = $('#quick');
  if (!quick.childElementCount) quick.innerHTML = merchants.slice(0, 6).map((item, index) =>
    `<button type="button" class="quick-button" data-merchant="${index}" aria-pressed="${merchant === item}">${icon(item.icon)}${escape(item.name)}</button>`).join('');
  quick.querySelectorAll('[data-merchant]').forEach((button, index) =>
    button.setAttribute('aria-pressed', String(merchant === merchants[index])));
}
function closeSuggestions() {
  suggestions.hidden = true;
  matchIndex = -1;
  search.setAttribute('aria-expanded', 'false');
  search.removeAttribute('aria-activedescendant');
}
function selectMatch(item) {
  merchant = item.merchant ?? null;
  search.value = item.label;
  category.value = item.category;
  closeSuggestions();
  renderQuick();
  renderResults();
  if (item.custom) {
    category.focus();
    notice('Choose the purchase category for this merchant.');
  }
}
function updateSuggestions() {
  const typed = search.value.trim().slice(0, 100);
  const query = normalizeMerchant(typed);
  matches = [
    ...merchants.map(item => ({ merchant: item, label: item.name, category: item.category, keywords: item.keywords })),
    ...categoryOptions.map(([key, label]) => ({ label, category: key, keywords: key })),
  ].map(item => {
    const name = normalizeMerchant(item.label);
    const aliases = normalizeMerchant(item.keywords);
    const score = name === query ? 4 : name.startsWith(query) ? 3
      : name.includes(query) ? 2 : aliases.includes(query) ? 1 : 0;
    return { ...item, score };
  }).filter(item => item.score)
    .sort((first, second) => second.score - first.score)
    .slice(0, 7);
  if (typed && !matches.some(item => item.merchant && item.score === 4)) {
    matches.push({ merchant: { name: typed, custom: true }, label: typed, category: 'other', custom: true });
  }
  matchIndex = -1;
  search.removeAttribute('aria-activedescendant');
  suggestions.innerHTML = matches.map((item, index) =>
    `<li id="match-${index}" role="option" aria-selected="false" data-match="${index}"><strong>${escape(item.label)}</strong><span>${escape(item.custom ? 'Use unlisted merchant' : item.merchant ? categories[item.category] : 'Category')}</span></li>`).join('')
    || '<li class="no-match" role="presentation">No matches. Choose a purchase category below.</li>';
  suggestions.hidden = false;
  search.setAttribute('aria-expanded', 'true');
}
search.addEventListener('input', () => {
  if (merchant && search.value !== merchant.name) {
    merchant = null;
    renderQuick();
    renderResults();
  }
  updateSuggestions();
});
search.addEventListener('focus', updateSuggestions);
search.addEventListener('blur', closeSuggestions);
search.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeSuggestions(); return; }
  if (event.key === 'Enter' && !suggestions.hidden && matches.length) {
    event.preventDefault();
    selectMatch(matches[Math.max(0, matchIndex)]);
    return;
  }
  if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
  event.preventDefault();
  if (suggestions.hidden) updateSuggestions();
  if (!matches.length) return;
  matchIndex = matchIndex < 0 ? (event.key === 'ArrowDown' ? 0 : matches.length - 1)
    : (matchIndex + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length;
  suggestions.querySelectorAll('[role=option]').forEach((node, index) =>
    node.setAttribute('aria-selected', String(index === matchIndex)));
  search.setAttribute('aria-activedescendant', `match-${matchIndex}`);
  $(`#match-${matchIndex}`).scrollIntoView({ block: 'nearest' });
});
suggestions.addEventListener('pointerdown', event => event.preventDefault());
suggestions.addEventListener('click', event => {
  const option = event.target.closest('[data-match]');
  if (option) selectMatch(matches[Number(option.dataset.match)]);
});
$('#quick').addEventListener('click', event => {
  const button = event.target.closest('[data-merchant]');
  if (!button) return;
  const item = merchants[Number(button.dataset.merchant)];
  selectMatch({ merchant: item, label: item.name, category: item.category });
});
category.addEventListener('change', () => {
  if (!merchant?.custom) {
    merchant = null;
    search.value = '';
  }
  renderQuick();
  renderResults();
});
amount.addEventListener('input', renderResults);

const form = $('#card-form');
const custom = { name: '', issuer: '', network: 'Visa', unit: 'cash', pointValue: 1, base: 1, rates: {}, color: 'mint' };
const input = (name, value, attrs = '') => `<input name="${name}" value="${escape(value)}" ${attrs}>`;
const numeric = (name, value, max = 100) => input(name, value, `type="number" min="0" max="${max}" step="0.01" inputmode="decimal"`);
const label = (caption, field) => `<label>${caption}${field}</label>`;
const select = (name, entries, selected) => `<select name="${name}">${options(entries, selected)}</select>`;

function drawEditor(card, productId) {
  const ownedIds = new Set((wallet ?? []).filter(entry => entry.id !== editingId).map(entry => entry.productId));
  const products = catalog.filter(entry => !ownedIds.has(entry.id)).map(entry => [entry.id, entry.name]);
  const rotation = card.rotation ?? { enabled: false, category: 'grocery', rate: 5, remaining: 1500 };
  const quarter = currentQuarter();
  const rotationActive = rotation.enabled && rotation.quarter === quarter;
  const annualYear = new Date().getFullYear();
  $('#editor-fields').innerHTML = `
    ${label('Card template', select('product', [['custom', 'Custom card'], ...products], productId))}
    ${card.source ? `<p class="terms"><a href="${escape(card.source)}" target="_blank" rel="noopener noreferrer">View issuer reward terms</a></p>` : ''}
    <div class="form-grid">
      ${label('Card name', input('name', card.name, 'required maxlength="70"'))}
      ${label('Issuer', input('issuer', card.issuer, 'maxlength="35"'))}
      ${label('Network', select('network', ['Visa', 'Mastercard', 'Amex', 'Discover', 'Other'].map(x => [x, x]), card.network))}
      ${label('Reward type', select('unit', [['cash', 'Cash back (%)'], ['points', 'Points per dollar (×)']], card.unit))}
      ${label('Base rate', numeric('base', card.base))}
      <div id="point-value"${card.unit === 'points' ? '' : ' hidden'}>${label('Point value in cents', numeric('pointValue', card.pointValue, 20))}</div>
    </div>
    <label class="checkbox"><input name="active" type="checkbox"${card.active === false ? '' : ' checked'}> Include in recommendations</label>
    <details class="form-details"><summary>Category reward rates</summary>
      <p>Leave a category blank to use the base rate.</p>
      <div class="form-grid">${categoryOptions.map(([key, name]) => label(name, numeric(`rate-${key}`, card.rates?.[key] ?? ''))).join('')}</div>
    </details>
    ${card.caps ? `<details class="form-details"><summary>Annual bonus spending</summary>
      <p>Enter your ${annualYear} eligible spending so far. Estimates split purchases that cross a cap.</p>
      <div class="form-grid">${Object.entries(card.caps).map(([key, cap]) => label(`${categories[key] ?? 'Combined eligible fuel'} · ${money(cap)} cap`, numeric(`spent-${key}`, card.spendYear === annualYear ? card.spent?.[key] ?? 0 : 0, 1000000))).join('')}</div></details>` : ''}
    <details class="form-details"><summary>Rotating bonus · ${quarter}</summary>
      <p>Enter your issuer’s current offer and remaining eligible spend. The bonus expires at quarter end.</p>
      <label class="checkbox"><input name="rotation" type="checkbox"${rotationActive ? ' checked' : ''}> Activated with issuer</label>
      <div class="form-grid">
        ${label('Bonus category', select('bonusCategory', categoryOptions, rotation.category))}
        ${label('Total bonus rate', numeric('bonusRate', rotation.rate))}
        ${label('Remaining spend ($)', numeric('bonusRemaining', rotationActive || !card.rotation ? rotation.remaining : '', 1000000))}
      </div>
    </details>`;
  form.elements.product.onchange = () => {
    const id = form.elements.product.value;
    drawEditor(findCard(id) ?? custom, id);
  };
  form.elements.unit.onchange = () => { $('#point-value').hidden = form.elements.unit.value !== 'points'; };
}
function openEditor(card) {
  editingId = card?.id ?? null;
  $('#editor-title').textContent = card ? 'Edit card' : 'Add a card';
  $('#remove').hidden = !card;
  const first = catalog.find(entry => !(wallet ?? []).some(owned => owned.productId === entry.id));
  const template = card ?? first ?? custom;
  drawEditor(template, card ? card.productId ?? 'custom' : first?.id ?? 'custom');
  dialog.showModal();
}
function persist(cards, message) {
  wallet = cards;
  const stored = saveWallet(wallet);
  dialog.close();
  renderWallet();
  renderResults();
  notice(stored ? message : `${message} Browser storage is unavailable. Changes last for this session.`);
}
$('#add').onclick = () => openEditor();
$('#wallet-list').onclick = event => {
  const button = event.target.closest('[data-edit]');
  if (button) openEditor(wallet[Number(button.dataset.edit)]);
};
dialog.querySelectorAll('[data-close]').forEach(button => { button.onclick = () => dialog.close(); });
form.addEventListener('input', event => event.target.setCustomValidity?.(''));
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get('name').trim();
  if (!name) {
    form.elements.name.setCustomValidity('Enter a card name.');
    form.elements.name.reportValidity();
    return;
  }
  const product = findCard(data.get('product'));
  const rates = Object.fromEntries(categoryOptions.filter(([key]) => data.get(`rate-${key}`) !== '')
    .map(([key]) => [key, Number(data.get(`rate-${key}`))]));
  const card = {
    ...product, id: editingId ?? crypto.randomUUID(), productId: product?.id ?? null,
    name, issuer: data.get('issuer').trim(), network: data.get('network'), color: product?.color ?? custom.color,
    unit: data.get('unit'), pointValue: data.get('pointValue') === '' ? 1 : Number(data.get('pointValue')),
    base: Number(data.get('base')), rates, active: data.has('active'),
    spendYear: new Date().getFullYear(),
    spent: Object.fromEntries(Object.keys(product?.caps ?? {}).map(key => [key, Number(data.get(`spent-${key}`))])),
    rotation: {
      enabled: data.has('rotation'), category: data.get('bonusCategory'),
      rate: Number(data.get('bonusRate')), remaining: Number(data.get('bonusRemaining')), quarter: currentQuarter(),
    },
  };
  const cards = wallet ?? [];
  persist(editingId ? cards.map(entry => entry.id === editingId ? card : entry) : [...cards, card],
    editingId ? 'Card updated.' : 'Card added.');
});
$('#remove').onclick = () => {
  if (window.confirm('Remove this card from your wallet?')) persist(wallet.filter(card => card.id !== editingId), 'Card removed.');
};

const install = $('#install');
const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
if (ios && !navigator.standalone && window.top === window.self) install.hidden = false;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installing = event;
  install.hidden = false;
});
window.addEventListener('appinstalled', () => { install.hidden = true; installing = null; });
install.onclick = async () => {
  if (!installing) {
    notice('In Safari, use Share, then Add to Home Screen.');
    return;
  }
  const prompt = installing;
  installing = null;
  install.hidden = true;
  try { await prompt.prompt(); }
  catch { notice('Open your browser menu to install WalletWise.'); }
};
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(error => console.warn('Offline setup failed', error));
}
renderQuick();
renderWallet();
renderResults();

fetch('./market.json', { cache: 'no-cache' })
  .then(response => response.ok ? response.json() : null)
  .then(feed => {
    if (!feed?.cards?.length) return;
    mergeMarket(feed.cards);
    $('#catalog-date').textContent = `Issuer-checked catalog + CardAPI · market feed synced ${feed.syncedAt.slice(0, 10)}`;
    renderResults();
  })
  .catch(() => {});
