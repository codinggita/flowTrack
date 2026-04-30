import {
  startOfMonth, endOfMonth, startOfYear, endOfYear,
  startOfQuarter, endOfQuarter, subMonths,
} from 'date-fns';

export const getPeriodRange = (period = 'this-month') => {
  const now = new Date();
  switch (period) {
    case 'this-month':   return { start: startOfMonth(now),           end: endOfMonth(now) };
    case 'last-month':   return { start: startOfMonth(subMonths(now,1)), end: endOfMonth(subMonths(now,1)) };
    case 'this-quarter': return { start: startOfQuarter(now),          end: endOfQuarter(now) };
    case 'ytd':          return { start: startOfYear(now),             end: now };
    default:             return { start: startOfMonth(now),            end: endOfMonth(now) };
  }
};

export const parseMonthPeriod = (str) => {
  if (!str) return getPeriodRange('this-month');
  const months = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  const [m, y] = str.split('-');
  if (months[m] === undefined || !y) return getPeriodRange('this-month');
  return {
    start: new Date(parseInt(y), months[m], 1),
    end:   new Date(parseInt(y), months[m]+1, 0, 23, 59, 59),
  };
};
