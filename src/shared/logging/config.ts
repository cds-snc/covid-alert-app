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
    status: 0,
    debug: 1,
    info: 2,
    error: 3,
  },
};

export const log = logger.createLogger(config);

export const isTest = () => {
  return process.env.JEST_WORKER_ID !== undefined;
};
