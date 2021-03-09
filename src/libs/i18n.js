import i18njs from 'i18n-js';
import { pt } from '../locales/ptbr';
import { en } from '../locales/en';

const i18n = i18njs;
i18n.translations = {
  'pt-br': pt,
  en,
};
i18n.defaultLocale = 'pt-br';
i18n.locale = 'pt-br';

export default function text(key, language = 'pt-br', value) {
  i18n.locale = language;
  return i18n.t(key, value);
}
