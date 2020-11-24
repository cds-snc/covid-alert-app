import {log} from './logging/config';

const isTest = () => {
  return process.env.JEST_WORKER_ID !== undefined;
};

export const captureMessage = async (message: string, params: {[key in string]: any} = {}) => {
  if (__DEV__ && !isTest()) {
    log.info({
      message,
      payload: params,
    });
  }
};

export const captureException = async (message: string, error: any, params: {[key in string]: any} = {}) => {
  if (__DEV__ && !isTest()) {
    log.error({
      message,
      error,
    });
  }
};
