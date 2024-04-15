import mail, { MailService } from "@sendgrid/mail";

export type Templates = "signin" | "signup";

export type SendData = {
  to: string;
  dynamicTemplateData: Record<string, unknown>;
};

export class Mailer {
  private mail: MailService;

  private templates: Record<Templates, string>;

  private from: string;

  private devMode: boolean;

  constructor(apiKey: string, devMode = false) {
    this.mail = mail;
    this.mail.setApiKey(apiKey);
    this.devMode = devMode;

    this.templates = {
      signin: process.env.SENDGRID_TEMPLATE_SIGNIN as string,
      signup: process.env.SENDGRID_TEMPLATE_SIGNUP as string,
    };

    this.from = process.env.SENDGRID_FROM_ADDRESS as string;
  }

  async send(template: Templates, data: SendData) {
    const { to, dynamicTemplateData } = data;

    // Dev mode wil print the mail to console
    if (this.devMode) {
      console.log(
        `[pa/mailer] New email to ${to} for ${template} - ${JSON.stringify(
          dynamicTemplateData
        )}`
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
    } catch (error) {
      console.log("[pa/mailer] Failed to send email", JSON.stringify(error));
    }
  }
}

/* Export as singelton */
const getMailerSingelton = () => {
  return new Mailer(
    process.env.SENDGRID_API_KEY as string,
    process.env.NODE_ENV !== "production"
  );
};

declare global {
  var mailerGlobal: undefined | ReturnType<typeof getMailerSingelton>;
}

const mailer = globalThis.mailerGlobal ?? getMailerSingelton();

export default mailer;

if (process.env.NODE_ENV !== "production") globalThis.mailerGlobal = mailer;
