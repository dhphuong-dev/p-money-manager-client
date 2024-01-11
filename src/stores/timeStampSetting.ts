import { TimeRangeLocalStorage, TimeRange } from '@/constants/timeStamp.enum';

interface ITimeRangeSetting {
  timeRange: TimeRange;
}

export const useTimeRangeSettingStore = defineStore('TimeSetting', {
  state: (): ITimeRangeSetting => ({
    timeRange: TimeRange[localStorage.getItem(TimeRangeLocalStorage.TimeRange)!] || TimeRange.MONTH
  }),
  actions: {
    changeTimeRange(timeRange: TimeRange): void {
      localStorage.setItem(TimeRangeLocalStorage.TimeRange, timeRange);
      this.timeRange = timeRange;
    }
  }
});
