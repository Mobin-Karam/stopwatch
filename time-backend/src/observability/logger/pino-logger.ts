import pino from 'pino';
import fs from 'fs';
import path from 'path';

const logLevel = process.env.LOG_LEVEL || 'info';
const usePretty = process.env.LOG_PRETTY === 'true';
const writeToFile = process.env.LOG_TO_FILE === 'true';
const logFilePath =
  process.env.LOG_FILE_PATH || path.join(process.cwd(), 'logs/app.log');

const transport = (() => {
  if (usePretty)
    return { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } };
  if (writeToFile) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    return {
      target: 'pino/file',
      options: { destination: logFilePath, mkdir: true },
    };
  }
  return undefined;
})();

export const appLogger = pino({
  level: logLevel,
  transport,
});
