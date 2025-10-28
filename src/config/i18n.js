import { I18n } from "i18n-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load translations
const rw = JSON.parse(readFileSync(join(__dirname, "../locales/rw.json"), "utf-8"));
const en = JSON.parse(readFileSync(join(__dirname, "../locales/en.json"), "utf-8"));

// Initialize i18n
const i18n = new I18n({
  rw, // Kinyarwanda first
  en,
});

i18n.defaultLocale = "rw"; // Default language
i18n.locale = "rw";        // Active language
i18n.enableFallback = true;

/**
 * Translate text by key
 * @param {string} key - Translation key
 * @param {Object} options - Interpolation values
 * @param {string} locale - Optional locale override
 * @returns {string}
 */
export const t = (key, options = {}, locale = null) => {
  return i18n.t(key, { ...options, locale: locale || i18n.locale });
};

/**
 * Set the current language
 * @param {string} locale - 'rw' or 'en'
 */
export const setLocale = (locale) => {
  if (["rw", "en"].includes(locale)) i18n.locale = locale;
};

/**
 * Get the current language
 * @returns {string}
 */
export const getLocale = () => i18n.locale;

/**
 * Translate using a specific locale directly
 * @param {string} key - Translation key
 * @param {string} locale - 'rw' or 'en'
 * @param {Object} options
 * @returns {string}
 */
export const tl = (key, locale, options = {}) => {
  return i18n.t(key, { ...options, locale });
};

export default i18n;
