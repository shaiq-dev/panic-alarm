import cypher from "@/lib/cypher";
import prisma from "@/lib/db";
import mailer, { Templates } from "@/lib/mailer";
import { OtpCharacterSet, generateOtp } from "@/utils/generate-otp";

export type CreateValidationContextOptions<P> = {
  validationEmail: string;
  validationEmailTemplate: Templates;
  validationPayload: P;
  otpLength?: number;
  otpCharSet?: OtpCharacterSet;
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
