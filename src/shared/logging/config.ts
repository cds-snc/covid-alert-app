import {LOG_LEVEL} from 'env';
import {logger} from 'react-native-logs';

import {consoleTransport} from './transports/console-transport';
import {logglyTransport} from './transports/loggly-transport';

const config = {
  transport: (msg: string | object | Function, level: {severity: number; text: string}, options: any) => {
    consoleTransport(msg, level, options);
    logglyTransport(msg, level, options);
  },
  severity: LOG_LEVEL,
  levels: {
    silly: 0,
    info: 1,
    warn: 2,
    error: 3,
    mad: 4,
  },
};
const log = logger.createLogger(config);

export {log};
