export const base64Encode = (input: string) => {
  const aBytes = new TextEncoder().encode(input);
  const bin = Array.from(aBytes, x => String.fromCodePoint(x)).join("");
  return btoa(bin);
};

export const base64Decode = (input: string) => {
  let encodedString = input.replace(/-/g, "+").replace(/_/g, "/");
  switch (encodedString.length % 4) {
    case 0:
      break;
    case 2:
      encodedString += "==";
      break;
    case 3:
      encodedString += "=";
      break;
    default:
      throw new Error("Invalid base64 encoded string");
  }
  const bin = atob(encodedString);
  return new TextDecoder().decode(Uint8Array.from(bin, x => x.codePointAt(0) || 0));
};
