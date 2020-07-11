export const localLog = async (message: string, params: {[key in string]: any} = {}) => {
  const url = `http://192.168.0.24:3001/${encodeURI(message)}/${encodeURI(JSON.stringify(params))}`;
  await fetch(url).catch(() => {});
};
