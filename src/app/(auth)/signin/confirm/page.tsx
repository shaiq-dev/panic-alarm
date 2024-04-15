"use client";

import { useRef, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { readSessionStorageValue } from "@mantine/hooks";

import {
  CONFIRM_PAGE_DESCRIPTION,
  SESSION_LAST_CLOG,
} from "@/constants/app-strings";
import { SessionLastClog } from "@/types";
import { verifyAuthSessionClog } from "@/utils/verify-auth-session-clog";
import { verfiySignin } from "@/app/_actions/verify-signin";
import { sb } from "@/utils/string-builder";
import { ValidateOtp } from "../../_components/ValidateOtp";

export default function ConfirmPage() {
  const state = useSearchParams().get("state");
  const clog = readSessionStorageValue<SessionLastClog>({
    key: SESSION_LAST_CLOG,
  }); 

  const verifyAuthSession = verifyAuthSessionClog({
    state,
    clog,
    src: "signin",
  });

  if (!verifyAuthSession) {
    redirect("/signin");
  }
  const { email, validationId } = verifyAuthSession;

  const [otp, setOtp] = useState<{
    value: string;
    error: boolean;
    checking: boolean;
  }>({
    value: "",
    error: false,
    checking: false,
  });

  const ref = useRef<HTMLInputElement | null>(null);

  const onComplete = async (value: string) => {
    setOtp((p) => ({ ...p, checking: true }));
    const resp = await verfiySignin({ otp: value, validationId });

    // If otp is valid, user will be redirected to dashboard
    if (resp && !resp.ok) {
      if (ref.current) {
        ref.current.focus();
      }

      setOtp((p) => ({
        ...p,
        checking: false,
        value: "",
        error: true,
      }));
    }
  };

  const handleChange = (value: string) => {
    if (otp.error && value.length > 0) {
      setOtp((p) => ({ ...p, value, error: false }));
      return;
    }
    setOtp((p) => ({ ...p, value }));
  };

  return (
    <>
      <ValidateOtp
        ref={ref}
        description={sb(CONFIRM_PAGE_DESCRIPTION, { email })}
        value={otp.value}
        onChange={handleChange}
        onComplete={onComplete}
        checking={otp.checking}
        error={otp.error}
      />
    </>
  );
}
