import {LOGGLY_URL, LOG_LEVEL} from 'env';
import {logger} from 'react-native-logs';

import {colourConsoleTransport} from './transports/colour-console';
import {logglyTransport} from './transports/loggly';
// import {consoleTransport} from './transports/console';

const config = {
  transport: (msg: string | object | Function, level: {severity: number; text: string}, options: any) => {
    colourConsoleTransport(msg, level, options);
    if (LOGGLY_URL) {
      logglyTransport(msg, level, options);
    }
  },
  severity: LOG_LEVEL,
  levels: {
    debug: 5,
    info: 10,
    warn: 15,
    error: 20,
  },
};

type Category = 'debug' | 'background' | 'configuration';

interface Log {
  info: (payload: {category?: Category; message?: string; payload?: string | {}}) => void;
  warn: (payload: {category?: Category; message?: string; payload?: string | {}}) => void;
  debug: (payload: {category?: Category; message?: string; payload?: string | {}}) => void;
  error: (payload: {category?: Category; message?: string; error?: string | {}}) => void;
}

const reactLogger = logger.createLogger(config);

export const log: Log = {
  debug: payload => {
    reactLogger.debug(payload);
  },
  info: payload => {
    reactLogger.info(payload);
  },
  warn: payload => {
    reactLogger.warn(payload);
  },
  error: payload => {
    reactLogger.error(payload);
  },
};

export const isTest = () => {
  return process.env.JEST_WORKER_ID !== undefined;
};
