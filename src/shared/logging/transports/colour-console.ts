import {transportFunctionType} from 'react-native-logs';

const colourConsoleTransport: transportFunctionType = async (msg, level, _options) => {
  const colours = {
    red: '\u001b[31m',
    black: '\u001b[30m',
    blue: '\u001b[34m',
    orange: '\u001b[33m',
    cyan: '\u001b[36m',
    green: '\u001b[32m',
    reset: '\u001b[0m',
  };

  let message: string;

  if (typeof msg === 'string') {
    message = msg;
  } else if (typeof msg === 'function') {
    message = '[function]';
  } else {
    message = JSON.stringify(msg);
  }

  switch (level.text) {
    case 'silly':
      console.log(`${colours.green}${message}${colours.reset}`); // eslint-disable-line no-console
      break;
    case 'info':
      console.info(`${colours.blue}${message}${colours.reset}`); // eslint-disable-line no-console
      break;
    case 'error':
      console.error(`${colours.red}${message}${colours.reset}`); // eslint-disable-line no-console
      break;
    case 'warn':
      console.warn(`${colours.orange}${message}${colours.reset}`); // eslint-disable-line no-console
      break;
    case 'debug':
      console.debug(`${colours.cyan}${message}${colours.reset}`); // eslint-disable-line no-console
      break;
    case 'mad':
      console.log(`${colours.orange}${message}${colours.reset}`); // eslint-disable-line no-console
      break;
    default:
      console.log(`${colours.black}${message}${colours.reset}`); // eslint-disable-line no-console
  }
};

export {colourConsoleTransport};
