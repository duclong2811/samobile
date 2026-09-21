export const locales = ["en", "ko", "vi", "zh", "th", "ne", "uz"] as const;
export type Locale = (typeof locales)[number];
export const localeNames: Record<Locale, string> = { en: "English", ko: "한국어", vi: "Tiếng Việt", zh: "简体中文", th: "ไทย", ne: "नेपाली", uz: "O'zbek" };
export const languageOptions = [
  { code: "ko", name: localeNames.ko },
  { code: "en", name: localeNames.en },
  { code: "vi", name: localeNames.vi },
  { code: "zh", name: localeNames.zh },
  { code: "th", name: localeNames.th },
  { code: "ne", name: localeNames.ne },
  { code: "uz", name: localeNames.uz },
] as const;
export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}
