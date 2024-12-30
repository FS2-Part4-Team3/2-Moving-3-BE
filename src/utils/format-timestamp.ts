function padTwoDigits(num) {
  return num.toString().padStart(2, '0');
}

export default function formatTimestamp(date: Date) {
  return (
    [date.getFullYear(), padTwoDigits(date.getMonth() + 1), padTwoDigits(date.getDate())].join('-') +
    ' ' +
    [padTwoDigits(date.getHours()), padTwoDigits(date.getMinutes()), padTwoDigits(date.getSeconds())].join(':')
  );
}
