import i18n, { t } from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import translationEn from "./locales/en-US.json";
import translationEs from "./locales/es-ES.json";
import translationAr from "./locales/ar-SA.json";
import translationDe from "./locales/de-DE.json";
import translationFr from "./locales/fr-FR.json";
import translationHe from "./locales/he-IL.json";
import translationHi from "./locales/hi-IN.json";
import translationIt from "./locales/it-IT.json";
import translationJa from "./locales/ja-JP.json";
import translationKo from "./locales/ko-KR.json";
import translationNl from "./locales/nl-NL.json";
import translationPt from "./locales/pt-PT.json";
import translationRu from "./locales/ru-RU.json";
import translationSv from "./locales/sv-SE.json";
import translationZhCN from "./locales/zh-CN.json";
import translationZhTW from "./locales/zh-TW.json";
import translationPl from "./locales/pl-PL.json";
import translationDa from "./locales/da-DK.json";
import translationTr from "./locales/tr-TR.json";
import translationCs from "./locales/cs-CZ.json";
import translationUk from "./locales/uk-UA.json";
import translationTh from "./locales/th-TH.json";
import { storage } from "@/storage/storage";

const resources = {
  "en-US": { translation: translationEn },
  "es-ES": { translation: translationEs },
  "ar-SA": { translation: translationAr },
  "de-DE": { translation: translationDe },
  "fr-FR": { translation: translationFr },
  "he-IL": { translation: translationHe },
  "hi-IN": { translation: translationHi },
  "it-IT": { translation: translationIt },
  "ja-JP": { translation: translationJa },
  "ko-KR": { translation: translationKo },
  "nl-NL": { translation: translationNl },
  "pt-PT": { translation: translationPt },
  "ru-RU": { translation: translationRu },
  "sv-SE": { translation: translationSv },
  "zh-CN": { translation: translationZhCN },
  "zh-TW": { translation: translationZhTW },
  "pl-PL": { translation: translationPl },
  "da-DK": { translation: translationDa },
  "tr-TR": { translation: translationTr },
  "cs-CZ": { translation: translationCs },
  "uk-UA": { translation: translationUk },
  "th-TH": { translation: translationTh },
};

export const getLanguage = (lang: string): string => {
  return i18n.getFixedT("en-US", null, ``)(`languages.${lang}`);
};
export const getLanguages = (): string[] => {
  return Object.keys(resources).sort();
};

export const setLanguage = async (lang: string) => {
  /*
 use storage correclty
 */
  storage.set("language", lang);
  await i18n.changeLanguage(lang);
};

const initI18n = async () => {
  /*
 use storage correclty
 */
  /*let savedLanguage = storage.getString("language");

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageTag;
  }*/

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    //lng: savedLanguage,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
