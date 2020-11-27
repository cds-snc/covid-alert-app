import {log, isTest} from './logging/config';

export const captureMessage = async (message: string, params: {[key in string]: any} = {}) => {
  if (__DEV__ && !isTest()) {
    log.info({
      message,
      payload: params,
    });
  }
};

export const captureException = async (message: string, error: any) => {
  if (__DEV__ && !isTest()) {
    log.error({
      message,
      error,
    });
  }
};
