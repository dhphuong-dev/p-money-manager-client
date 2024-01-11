import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { TimeRange } from '@/constants/timeStamp.enum';

interface Timeline {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  label: string | number;
}

const TimeFormat: string = 'YYYY/MM/DD';

const timelineGenerator = (timeRange: TimeRange): Timeline[] => {
  const timelines: Timeline[] = [];
  const today = dayjs();
  if (timeRange === TimeRange.DAY) {
    timelines.push(
      {
        start: today.add(1, 'd'),
        end: today.add(1, 'd'),
        label: 'Future'
      },
      {
        start: today,
        end: today,
        label: 'Today'
      }
    );
    for (let i = 1; i < 7; ++i) {
      const d = today.subtract(i, 'd');
      timelines.push({
        start: d,
        end: d,
        label: d.format(TimeFormat)
      });
    }
  } else if (timeRange === TimeRange.WEEK) {
    timelines.push(
      {
        start: dayjs().endOf('week').add(1),
        end: dayjs().endOf('week').add(1),
        label: `Future`
      },
      {
        start: dayjs().startOf('week'),
        end: dayjs().endOf('week'),
        label: `This Week`
      }
    );
    for (let i = 1; i < 7; i++) {
      const s = today.subtract(i, 'w').startOf('w');
      const e = today.subtract(i, 'w').endOf('w');
      timelines.push({
        start: s,
        end: e,
        label: `${s.format(TimeFormat)}-${e.format(TimeFormat)}`
      });
    }
  } else if (timeRange === TimeRange.MONTH) {
    timelines.push(
      {
        start: today.add(1, 'M').startOf('M'),
        end: today.add(1, 'M').endOf('M'),
        label: `Future`
      },
      {
        start: today.startOf('M'),
        end: today.endOf('M'),
        label: `This Month`
      }
    );
    for (let i = 1; i < 7; i++) {
      const s = today.subtract(i, 'M').startOf('M');
      const e = today.subtract(i, 'M').endOf('M');
      timelines.push({
        start: s,
        end: e,
        label: `${s.year()}/${(s.month() + 1).toString().padStart(2, '0')}`
      });
    }
  } else if (timeRange === TimeRange.YEAR) {
    timelines.push(
      {
        start: today.endOf('y').add(1),
        end: today.endOf('y').add(1),
        label: `Future`
      },
      {
        start: today.startOf('y'),
        end: today.endOf('y'),
        label: `This Year`
      }
    );
    for (let i = 1; i < 7; i++) {
      const s = today.subtract(i, 'y').startOf('y');
      const e = today.subtract(i, 'y').endOf('y');
      timelines.push({
        start: s,
        end: e,
        label: s.year()
      });
    }
  }
  return timelines;
};

const compare = (
  target: string | dayjs.Dayjs,
  timelines: Timeline[],
  timelineIndex: number = 1,
  timeRange: TimeRange
): boolean => {
  target = dayjs(target);
  const start = timelines[timelineIndex].start;
  if (timelineIndex === 0) {
    return target >= start;
  }
  if (timeRange === TimeRange.DAY) {
    return target.isSame(start, 'D');
  } else {
    const end = timelines[timelineIndex].end;
    const c: { [key: string]: dayjs.OpUnitType | null | undefined } = {
      [TimeRange.WEEK]: 'w',
      [TimeRange.MONTH]: 'M',
      [TimeRange.YEAR]: 'y'
    };
    return target.isBetween(start, end, c[timeRange], '[]');
  }
};

export { timelineGenerator, compare, type Timeline };
