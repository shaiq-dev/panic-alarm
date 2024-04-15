export const stringToJson = <T>(value: string) => {
  return JSON.parse(value) as T;
};
