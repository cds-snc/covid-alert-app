export const captureMessage = async (message: string, params: {[key in string]: any} = {}) => {
  const finalMessage = message;
  const finalParams = params;
  if (!__DEV__) {
    return;
  }
  console.log(finalMessage, finalParams);
};

export const captureException = async (message: string, error: any, params: {[key in string]: any} = {}) => {
  const finalMessage = `Error: ${message}`;
  const finalParams = {
    ...params,
    error: {
      message: error && error.message,
      error,
    },
  };
  if (!__DEV__) {
    return;
  }
  console.log(finalMessage, finalParams);
};
