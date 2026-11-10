import Vue from 'vue'

const storageKey = 'skyroom.football.session'

function restore() {
  try {
    const value = JSON.parse(sessionStorage.getItem(storageKey))
    if (value && typeof value.token === 'string' && value.token &&
      value.account && ['shop', 'admin'].includes(value.account.role) &&
      ['pending', 'approved'].includes(value.account.status)) return value
  } catch { /* A blocked or unavailable storage must not prevent login. */ }
  return { token: '', account: null }
}

export const shopSession = Vue.observable(restore())

export function saveShopSession(value) {
  shopSession.account = value.account
  shopSession.token = value.token
  try { sessionStorage.setItem(storageKey, JSON.stringify(value)) } catch { /* In-memory session remains usable. */ }
}

export function clearShopSession() {
  shopSession.account = null
  shopSession.token = ''
  try { sessionStorage.removeItem(storageKey) } catch { /* Storage may be blocked. */ }
}
