import {log, isTest} from './logging/config';
import {LOGGLY_URL} from 'env';

export const captureMessage = async (message: string, params: {[key in string]: any} = {}) => {
  if ((LOGGLY_URL || __DEV__) && !isTest()) {
    log.info({
      message,
      payload: params,
    });
  }
};

export const captureException = async (message: string, error: any) => {
  if ((LOGGLY_URL || __DEV__) && !isTest()) {
    log.error({
      message,
      error,
    });
  }
};
