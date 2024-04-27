import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";

const { stream, send } = logflarePinoVercel({
  apiKey: process.env.LOGFLARE_API_KEY!,
  sourceToken: process.env.LOGFLARE_SOURCE_ID!,
});

const logger = pino(
  {
    browser: {
      transmit: {
        level: "info",
        send: send,
      },
    },
    level: "debug",
    base: {
      env: process.env.NODE_ENV,
      revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
    },
  },
  stream
);

export default logger;
