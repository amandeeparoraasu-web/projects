const key = 'walletwise.wallet.v1';

export function readPreference(name, fallback) {
  try { return JSON.parse(localStorage.getItem(name)) ?? fallback; }
  catch { return fallback; }
}

export function savePreference(name, value) {
  try { localStorage.setItem(name, JSON.stringify(value)); return true; }
  catch { return false; }
}

export function readWallet() {
  const value = readPreference(key, null);
  return Array.isArray(value) ? value : null;
}
export const saveWallet = cards => savePreference(key, cards);
