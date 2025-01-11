export default function compareExp(exp: number) {
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime > exp) {
    throw new Error('expired Token');
  } else {
    // NOTE 남은 시간(초단위)
    const timeRemaining = exp - currentTime;

    return timeRemaining;
  }
}
