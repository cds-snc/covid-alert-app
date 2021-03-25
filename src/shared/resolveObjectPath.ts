export const resolveObjectPath = (path: string, obj: any) => {
  return path.split('.').reduce(function (prev, curr) {
    return prev ? prev[curr] : '';
  }, obj);
};
