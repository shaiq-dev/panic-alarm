import cypher from "@/lib/cypher";
import prisma from "@/lib/db";
import mailer, { Templates } from "@/lib/mailer";
import { OtpCharacterSet, generateOtp } from "@/utils/generate-otp";
import { Otp } from "@prisma/client/edge";

export type CreateValidationContextOptions<P> = {
  validationEmail: string;
  validationEmailTemplate: Templates;
  validationPayload: P;
  otpLength?: number;
  otpCharSet?: OtpCharacterSet;
};

export type VerifyValidationContextOptions = {
  validationId: string;
  otpValue: string;

  /* otp expiry in minutes */
  otpExpiry: number;
};

export const createValidationContext = async <P = unknown>(
  options: CreateValidationContextOptions<P>
) => {
  const {
    validationEmail,
    validationEmailTemplate,
    validationPayload,
    otpLength = 6,
    otpCharSet = "AlphaNumeric",
  } = options;

  // Encrypt into validation payload
  const encValidationPayload = cypher.encrypt(JSON.stringify(validationPayload));
  if (!encValidationPayload) {
    return null;
  }

  // Hold validation against otp
  const otp = generateOtp(otpLength, otpCharSet);
  const { validationId } = await prisma.otp.create({
    select: {
      validationId: true,
    },
    data: {
      validationPayload: encValidationPayload,
      value: otp,
    },
  });

  // No need to await the email delivery
  mailer.send(validationEmailTemplate, {
    to: validationEmail,
    dynamicTemplateData: { otp },
  });

  return validationId;
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

  if (!otp || otp.value !== otpValue || otp.used || isOtpExpired(otp, otpExpiry)) {
    return null;
  }

  const validationPayload = JSON.parse(cypher.decrypt(otp.validationPayload) || "") as P;
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
  const diff = Math.abs((new Date().getTime() - otp.updatedAt.getTime()) / (1000 * 60));
  return diff > expiry;
};
