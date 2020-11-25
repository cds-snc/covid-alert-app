import {transportFunctionType} from 'react-native-logs';

const consoleTransport: transportFunctionType = async (msg, level, _options) => {
  let message: string;

  if (typeof msg === 'string') {
    message = msg;
  } else if (typeof msg === 'function') {
    message = '[function]';
  } else {
    message = JSON.stringify(msg);
  }

  switch (level.text) {
    case 'info':
      console.info(message); // eslint-disable-line no-console
      break;
    case 'error':
      console.error(message); // eslint-disable-line no-console
      break;
    case 'warn':
      console.warn(message); // eslint-disable-line no-console
      break;
    case 'debug':
      console.debug(message); // eslint-disable-line no-console
      break;
    default:
      console.log(message); // eslint-disable-line no-console
  }
};

export {consoleTransport};
