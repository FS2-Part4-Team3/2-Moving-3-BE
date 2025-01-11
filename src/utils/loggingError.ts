import logger from '#utils/logger.js';
import stringifyJson from '#utils/stringifyJson.js';

export default function loggingError(err) {
  logger.error(`${err instanceof Error ? err : `Error: ` + stringifyJson(err)}`);
  if (err instanceof Error) {
    logger.error(`${err.stack}`);
  }
}
