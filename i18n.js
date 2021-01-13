const NextI18Next = require("next-i18next").default;
const { localeSubpaths } = require("./next.config").publicRuntimeConfig;

const localeSubpathVariations = {
  none: {},
  foreign: {
    fr: "fr",
    en: "en",
  },
  all: {
    en: "en",
    fr: "fr",
  },
};

module.exports = new NextI18Next({
  defaultLanguage: 'fr',
  otherLanguages: ["fr","en"],
  localeSubpaths: localeSubpathVariations[localeSubpaths],
});
