export function getDayStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDayEnd(date: Date) {
  return new Date(getDayStart(date).setHours(23, 59, 59, 999));
}

export function getNextDate(date: Date) {
  return new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000);
}

export function getNextWeek(date: Date) {
  return new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
}
