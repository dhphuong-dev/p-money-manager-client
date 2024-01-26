import { ELocalStorage } from '@/constants';

interface ISetting {
  darkMode: boolean;
}

export const useSettingStore = defineStore('settingStore', {
  state: (): ISetting => {
    return {
      darkMode: JSON.parse(localStorage.getItem(ELocalStorage.DARK_MODE) || 'false')
    };
  },
  actions: {
    changeTheme() {
      localStorage.setItem(ELocalStorage.DARK_MODE, JSON.stringify(!this.darkMode));
      this.darkMode = !this.darkMode;
    }
  }
});
