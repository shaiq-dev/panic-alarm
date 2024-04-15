import { SessionLastClog } from "@/types";
import { base64Decode } from "./base64";

export interface Props {
  state: string | null;
  clog?: SessionLastClog;
  src: "signup" | "signin";
}

export const verifyAuthSessionClog = (props: Props) => {
  const { state, clog, src } = props;

  if (!state || !clog || clog?.src !== src || !clog?.domains[0]) {
    return null;
  }

  const [validationId, email] = base64Decode(`${clog.domains[0]}`).split("#");
  const [stateValidationId, stateEmailValue] = base64Decode(`${state}`).split(
    "#"
  );

  if (validationId !== stateValidationId || email !== stateEmailValue) {
    return null;
  }

  return { email, validationId };
};
