import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import { SUPPORTED_LANGUAGES } from "./i18n.constants"
import enCommon from "./locales/en/common.json"
import plCommon from "./locales/pl/common.json"

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      [SUPPORTED_LANGUAGES.EN]: { translation: enCommon },
      [SUPPORTED_LANGUAGES.PL]: { translation: plCommon },
    },
    fallbackLng: SUPPORTED_LANGUAGES.EN,
    supportedLngs: Object.values(SUPPORTED_LANGUAGES),
    detection: {
      order: ["navigator"],
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
