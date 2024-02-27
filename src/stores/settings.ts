import { defineStore, acceptHMRUpdate } from 'pinia';

import { ELocalStorage } from '@/constants';
import { Theme, Currency, Language, TimeFormat, type ISetting } from '@/types/settings.type';

export const useSettingStore = defineStore('setting', () => {
  const settings = ref<ISetting>(
    JSON.parse(localStorage.getItem(ELocalStorage.SETTINGS)!) || {
      theme: Theme.LIGHT,
      language: Language.EN,
      currency: Currency.USD,
      timeFormat: TimeFormat['YYYY-MM-DD']
    }
  );
  function changeTheme(theme: Theme = Theme.DARK) {
    settings.value.theme = theme;
    localStorage.setItem(ELocalStorage.SETTINGS, JSON.stringify(settings.value));
  }
  function changeLanguage(language: Language = Language.VI) {
    settings.value.language = language;
    localStorage.setItem(ELocalStorage.SETTINGS, JSON.stringify(settings.value));
  }
  function changeCurrency(currency: Currency = Currency.VND) {
    settings.value.currency = currency;
    localStorage.setItem(ELocalStorage.SETTINGS, JSON.stringify(settings.value));
  }
  function changeTimeFormat(timeFormat: TimeFormat = TimeFormat['DD-MM-YYYY']) {
    settings.value.timeFormat = timeFormat;
    localStorage.setItem(ELocalStorage.SETTINGS, JSON.stringify(settings.value));
  }
  return { settings, changeTheme, changeLanguage, changeCurrency, changeTimeFormat };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot));
}
