import cypher from "@/lib/cypher";
import prisma from "@/lib/db";
import { Otp } from "@prisma/client";

export type VerifyValidationContextOptions = {
  validationId: string;
  otpValue: string;

  /* otp expiry in minutes */
  otpExpiry: number;
};

export const verifyValidationContext = async <P = unknown>(
  options: VerifyValidationContextOptions
) => {
  const { validationId, otpValue, otpExpiry } = options;

  const otp = await prisma.otp.findUnique({
    where: {
      validationId,
    },
  });

  if (
    !otp ||
    otp.value !== otpValue ||
    otp.used ||
    isOtpExpired(otp, otpExpiry)
  ) {
    return null;
  }

  const validationPayload = JSON.parse(
    cypher.decrypt(otp.validationPayload) || ""
  ) as P;
  if (!validationPayload) {
    return null;
  }

  await prisma.otp.update({
    where: { id: otp.id },
    data: {
      used: true,
    },
  });

  return validationPayload;
};

const isOtpExpired = (otp: Otp, expiry: number) => {
  const diff = Math.abs(
    (new Date().getTime() - otp.updatedAt.getTime()) / (1000 * 60)
  );
  return diff > expiry;
};
