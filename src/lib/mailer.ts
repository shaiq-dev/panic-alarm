import logger from "@/logging";
import { StringRecord } from "@/types";
import mail, { MailService } from "@sendgrid/mail";

export type DynamicTemplateData = {
  signin: StringRecord<"otp">;
  signup: StringRecord<"otp">;
  addNotifier: StringRecord<"watchOwner" | "watchName" | "doc_link" | "verification_link">;
};

export type Template = keyof DynamicTemplateData;

export type SendData<T extends Template> = {
  to: string;
  dynamicTemplateData: DynamicTemplateData[T];
};

export class Mailer {
  private mail: MailService;

  private templates: Record<Template, string>;

  private from: string;

  private devMode: boolean;

  constructor(apiKey: string, devMode = false) {
    this.mail = mail;
    this.mail.setApiKey(apiKey);
    this.devMode = devMode;

    this.templates = {
      signin: process.env.SENDGRID_TEMPLATE_SIGNIN as string,
      signup: process.env.SENDGRID_TEMPLATE_SIGNUP as string,
      addNotifier: process.env.SENDGRID_TEMPLATE_ADD_NOTIFIER as string,
    };

    this.from = process.env.SENDGRID_FROM_ADDRESS as string;
  }

  async send(template: Template, data: SendData<Template>) {
    const { to, dynamicTemplateData } = data;

    // Dev mode wil print the mail to console
    if (this.devMode) {
      logger.info(
        `[pa/mailer:dev] New email to ${to} for ${template} - ${JSON.stringify(dynamicTemplateData)}`
      );
      return;
    }

    try {
      await this.mail.send({
        to,
        from: {
          name: "PanicAlarm",
          email: this.from,
        },
        templateId: this.templates[template],
        dynamicTemplateData,
      });

      logger.info("Sent %s email to %s", template, to);
    } catch (error) {
      logger.error("Error occured while sending %s email to %s", template, to);
      logger.error(error);
    }
  }
}

/* Export as singelton */
const getMailerSingelton = () => {
  return new Mailer(process.env.SENDGRID_API_KEY as string, process.env.NODE_ENV !== "production");
};

declare global {
  var mailerGlobal: undefined | ReturnType<typeof getMailerSingelton>;
}

const mailer = globalThis.mailerGlobal ?? getMailerSingelton();

export default mailer;

if (process.env.NODE_ENV !== "production") globalThis.mailerGlobal = mailer;
