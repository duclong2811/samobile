import { isLocale, type Locale } from "./config";

export const preferenceKey = "samobile.language.v1";
let sessionPreference: Locale | null = null;

export function readPreference(): Locale | null {
  try {
    const saved = window.localStorage.getItem(preferenceKey);
    return saved && isLocale(saved) ? saved : sessionPreference;
  } catch {
    // Selection still works if the browser blocks storage.
    return sessionPreference;
  }
}

export function savePreference(locale: Locale) {
  sessionPreference = locale;
  try {
    window.localStorage.setItem(preferenceKey, locale);
  } catch {
    // Keep the preference for this client session without blocking navigation.
  }
}
