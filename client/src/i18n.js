import i18n from "i18next";
import i18nBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(i18nBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath:
        process.env.NODE_ENV === "production"
          ? "http://paugal.github.io/mobility-report/i18n/{{lng}}.json"
          : "http://localhost:3000/mobility-report/i18n/{{lng}}.json",
    },
  });

export default i18n;
