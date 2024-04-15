import { randomBytes } from "crypto";

export type OtpCharacterSet = "Numeric" | "AlphaNumeric" | "Alpha";

const characterSet: Record<OtpCharacterSet, string> = {
  Numeric: "0123456789",
  AlphaNumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  Alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};

export const generateOtp = (length: number, set: OtpCharacterSet) => {
  const characters = characterSet[set];
  const bytes = randomBytes(length);
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = bytes[i] % characters.length;
    otp += characters.charAt(randomIndex);
  }

  return otp;
};
