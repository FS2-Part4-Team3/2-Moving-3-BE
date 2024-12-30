import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDir = `${process.cwd()}/logs`;
const { combine, timestamp, label, printf, colorize, simple } = winston.format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const dateFormat = 'YYYY-MM-DD';
const timestampFormat = 'YYYY-MM-DD HH:mm:ss';

const dailyInfo = new DailyRotateFile({
  level: 'info',
  datePattern: dateFormat,
  dirname: logDir,
  filename: '%DATE%.log',
  maxFiles: 30,
  zippedArchive: true,
});

const dailyError = new DailyRotateFile({
  level: 'error',
  datePattern: dateFormat,
  dirname: `${logDir}/error`,
  filename: '%DATE%.error.log',
  maxFiles: 30,
  zippedArchive: true,
});

const logger = winston.createLogger({
  format: combine(label({ label: 'PandaMarket BackEnd' }), timestamp({ format: timestampFormat }), logFormat),
  transports: [dailyInfo, dailyError],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  );
}

export default logger;
