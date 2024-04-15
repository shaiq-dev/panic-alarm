export const maskCode = (code: string) => {
  return "xxxx-xxxx-" + code.slice(-4);
};
