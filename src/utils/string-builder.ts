/**
 * A simple string builder utility to modify constant app strings
 * @example sb("PaniAlarm watch is {{shoutout}} in {{color}}", {shoutout: "cool", color: "black"})
 */
export const sb = (value: string, subsitutes: Record<string, string>) => {
  if (!value) {
    return "";
  }

  return value.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return subsitutes.hasOwnProperty(key) ? subsitutes[key] : match;
  });
};
