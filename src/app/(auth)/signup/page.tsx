"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Divider, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useSessionStorage } from "@mantine/hooks";
import {
  ERROR_INAVLID_NAME,
  ERROR_INVALID_EMAIL,
  SESSION_LAST_CLOG,
  SIGNUP_PAGE_ALTERNATE_LINK_TEXT,
  SIGNUP_PAGE_ALTERNATE_LINK_TITLE,
  SIGNUP_PAGE_BUTTON_TEXT,
  SIGNUP_PAGE_DESCRIPTION,
  SIGNUP_PAGE_TITLE,
} from "@/constants/app-strings";
import { SessionLastClog } from "@/types";
import { base64Encode } from "@/utils/base64";
import { createAccount } from "../../_actions/create-account";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [_, setLastClog] = useSessionStorage<SessionLastClog>({
    key: SESSION_LAST_CLOG,
    // @see https://github.com/mantinedev/mantine/issues/6017#issuecomment-2031727307
    serialize: useCallback((value: any) => JSON.stringify(value), []),
  });

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
    },
    validate: {
      name: value =>
        value.trim().length >= 3 && /^[a-zA-Z ]{3,30}$/.test(value.trim())
          ? null
          : ERROR_INAVLID_NAME,
      email: isEmail(ERROR_INVALID_EMAIL),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const resp = await createAccount(values);

    console.log({ resp });

    if (!resp.ok) {
      setLoading(false);
      console.log("Error occurred", resp.error);
      return;
    }

    const state = base64Encode(`${resp.validationId}#${values.email}`).replaceAll("=", "");

    setLastClog({
      src: "signup",
      event: "confirm",
      domains: [state],
    });

    router.push(`/signup/confirm?state=${state}`);
  };

  return (
    <>
      <h1 className="text-[56px] font-medium pb-2">{SIGNUP_PAGE_TITLE}</h1>
      <p className="font-light mb-8">{SIGNUP_PAGE_DESCRIPTION}</p>
      <div className="w-[400px]">
        <form
          className="change-mantine-input-focus with-shadow font-light"
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <TextInput
            placeholder="John Doe"
            className="mb-6"
            size="md"
            {...form.getInputProps("name")}
          />
          <TextInput
            placeholder="name@example.com"
            className="mb-6"
            size="md"
            {...form.getInputProps("email")}
          />
          <Button color="var(--color-teal)" size="md" type="submit" loading={loading} fullWidth>
            {SIGNUP_PAGE_BUTTON_TEXT}
          </Button>
          <Divider label="OR" className="my-8" />
          <p className="text-center text-dimmed">
            {SIGNUP_PAGE_ALTERNATE_LINK_TITLE}{" "}
            <Link href="/signin" className="link font-normal">
              {SIGNUP_PAGE_ALTERNATE_LINK_TEXT}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
