import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { TimeRange } from '@/constants';
import { useTransactionFilterStore } from '@/stores/TransactionFilter';

interface Timeline {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  label: string | number;
}

const TimeFormat: string = 'YYYY/MM/DD';

const timelineGenerator = (
  timeRange: TimeRange,
  addFuture?: boolean,
  nums?: number
): Timeline[] => {
  const timelines: Timeline[] = [];
  const today = dayjs();
  if (timeRange === TimeRange.Day) {
    nums ??= 7;
    addFuture ??= true;
    addFuture &&
      timelines.push({
        start: today.add(1, 'd'),
        end: today.add(1, 'd'),
        label: 'Future'
      });
    timelines.push({
      start: today,
      end: today,
      label: 'Today'
    });
    for (let i = 1; i < nums; ++i) {
      const d = today.subtract(i, 'd');
      timelines.push({
        start: d,
        end: d,
        label: d.format(TimeFormat)
      });
    }
  } else if (timeRange === TimeRange.Week) {
    nums ??= 7;
    addFuture ??= true;
    addFuture &&
      timelines.push({
        start: dayjs().endOf('week').add(1),
        end: dayjs().endOf('week').add(1),
        label: `Future`
      });
    timelines.push({
      start: dayjs().startOf('week'),
      end: dayjs().endOf('week'),
      label: `This Week`
    });
    for (let i = 1; i < nums; i++) {
      const s = today.subtract(i, 'w').startOf('w');
      const e = today.subtract(i, 'w').endOf('w');
      timelines.push({
        start: s,
        end: e,
        label: `${s.format(TimeFormat)}-${e.format(TimeFormat)}`
      });
    }
  } else if (timeRange === TimeRange.Month) {
    nums ??= 6;
    addFuture ??= true;
    addFuture &&
      timelines.push({
        start: today.add(1, 'M').startOf('M'),
        end: today.add(1, 'M').endOf('M'),
        label: `Future`
      });
    timelines.push({
      start: today.startOf('M'),
      end: today.endOf('M'),
      label: `This Month`
    });
    for (let i = 1; i < nums; i++) {
      const s = today.subtract(i, 'M').startOf('M');
      const e = today.subtract(i, 'M').endOf('M');
      timelines.push({
        start: s,
        end: e,
        label: `${s.year()}/${(s.month() + 1).toString().padStart(2, '0')}`
      });
    }
  } else if (timeRange === TimeRange.Year) {
    nums ??= 4;
    addFuture ??= true;
    addFuture &&
      timelines.push({
        start: today.endOf('y').add(1),
        end: today.endOf('y').add(1),
        label: `Future`
      });
    timelines.push({
      start: today.startOf('y'),
      end: today.endOf('y'),
      label: `This Year`
    });
    for (let i = 1; i < nums; i++) {
      const s = today.subtract(i, 'y').startOf('y');
      const e = today.subtract(i, 'y').endOf('y');
      timelines.push({
        start: s,
        end: e,
        label: s.year()
      });
    }
  } else if (timeRange === TimeRange.All) {
    timelines.push({
      label: 'All transactions',
      start: today,
      end: today
    });
  } else if (timeRange === TimeRange.Custom) {
    const filter = useTransactionFilterStore();
    const { start, end } = filter.transactionFilter;
    timelines.push({
      start: dayjs(start),
      end: dayjs(end),
      label: `${dayjs(start).format(TimeFormat)}-${dayjs(end).format(TimeFormat)}`
    });
  }
  return timelines;
};

const compare = (
  target: string | dayjs.Dayjs,
  timelines: Timeline[],
  timelineIndex: number = 1,
  timeRange: TimeRange
): boolean => {
  if (timeRange === TimeRange.All) {
    return true;
  }
  target = dayjs(target);
  const start: dayjs.Dayjs = timelines[timelineIndex].start;
  if (timelineIndex === 0 && timeRange !== TimeRange.Custom) {
    return target >= start;
  }
  const end: dayjs.Dayjs = timelines[timelineIndex].end;
  return target.isBetween(start, end, 'd', '[]');
};

export { timelineGenerator, compare, type Timeline };
