const NextI18Next = require("next-i18next").default;
const { localeSubpaths } = require("./next.config").publicRuntimeConfig;

const localeSubpathVariations = {
  none: {},
  foreign: {
    fr: "fr",
  },
  all: {
    en: "en",
    fr: "fr",
  },
};

module.exports = new NextI18Next({
  defaultLanguage: 'fr',
  otherLanguages: ["fr"],
  localeSubpaths: localeSubpathVariations[localeSubpaths],
});
