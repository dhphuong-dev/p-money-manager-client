import type { SelectOption } from 'naive-ui';

enum TimeRange {
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
  All = 'All',
  Custome = 'Custom'
}

enum ViewBy {
  TRANSACTION = 'TRANSACTION',
  CATEGORY = 'CATEGORY'
}

enum TransactionFilterStorage {
  TimeRange = 'p-money-manager-time-stamp-range',
  ViewBy = 'p-money-manager-view-by'
}

export { TimeRange, ViewBy, TransactionFilterStorage };
