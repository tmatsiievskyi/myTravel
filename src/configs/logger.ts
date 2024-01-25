import winston from 'winston';

import { NODE_ENV } from './env';

const { createLogger, format, transports } = winston;
const { combine, timestamp, colorize, printf } = format;

const prodFormat = () => {
  const replaceError = ({ label, level, message, stack }: any) => ({
    label,
    level,
    message,
    stack,
  });

  const replacer = (key: string, value: any) =>
    value instanceof Error ? replaceError(value) : value;

  return combine(format.json({ replacer }));
};

const devFormat = () => {
  const formatMessage = (info: any) => {
    if (typeof info.message === 'object') {
      info.message = JSON.stringify(info.message, null, 4);
    }
    return ` ${info.level}  ${info.message}`;
  };
  const formatError = (info: any) =>
    `${info.level} ${info.message}\n\n${info.stack}\n${info.timestamp}\n`;

  const fmt = (info: any) =>
    info instanceof Error ? formatError(info) : formatMessage(info);

  return combine(format.timestamp(), colorize(), printf(fmt));
};

export const logger = createLogger({
  exitOnError: false,
  format: NODE_ENV === 'production' ? prodFormat() : devFormat(),
  level: 'info',
  transports: [new transports.Console()],
});
