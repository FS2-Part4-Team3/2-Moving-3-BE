export default function secondsToHMS(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const result = `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(remainingSeconds)}`;

  return result;
}
