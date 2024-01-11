import type { SelectOption } from 'naive-ui';

enum TimeRange {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR'
}

enum TimeRangeLocalStorage {
  TimeRange = 'p-money-manager-time-stamp-range'
}

const TimeStampSettings: SelectOption[] = [
  {
    label: 'Day',
    value: TimeRange.DAY
  },
  {
    label: 'Week',
    value: TimeRange.WEEK
  },
  {
    label: 'Month',
    value: TimeRange.MONTH
  },
  {
    label: 'Year',
    value: TimeRange.YEAR
  }
];

const TimeLines = {
  [TimeRange.DAY]: ['']
};

export { TimeRange, TimeRangeLocalStorage, TimeStampSettings, TimeLines };
