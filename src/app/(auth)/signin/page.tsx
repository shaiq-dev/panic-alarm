"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Divider, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";

import {
  ERROR_INVALID_EMAIL,
  SESSION_LAST_CLOG,
  SIGNIN_PAGE_ALTERNATE_LINK_TEXT,
  SIGNIN_PAGE_ALTERNATE_LINK_TITLE,
  SIGNIN_PAGE_BUTTON_TEXT,
  SIGNIN_PAGE_DESCRIPTION,
  SIGNIN_PAGE_TITLE,
} from "@/constants/app-strings";
import { signin } from "@/app/_actions/signin";
import { base64Encode } from "@/utils/base64";
import { useSessionStorage } from "@mantine/hooks";
import { SessionLastClog } from "@/types";

export default function SigninPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [_, setLastClog] = useSessionStorage<SessionLastClog>({
    key: SESSION_LAST_CLOG,
    // @see https://github.com/mantinedev/mantine/issues/6017#issuecomment-2031727307
    serialize: useCallback((value: any) => JSON.stringify(value), []),
  });

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: isEmail(ERROR_INVALID_EMAIL),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const resp = await signin({ ...values });

    console.log({ resp });

    if (!resp.ok) {
      setLoading(false);
      console.log("Error occurred", resp.error);
      return;
    }

    const state = base64Encode(
      `${resp.validationId}#${values.email}`
    ).replaceAll("=", "");

    setLastClog({
      src: "signin",
      event: "confirm",
      domains: [state],
    });

    router.push(`/signin/confirm?state=${state}`);
  };

  return (
    <>
      <h1 className="text-[56px] font-medium pb-2">{SIGNIN_PAGE_TITLE}</h1>
      <p className="mb-8">{SIGNIN_PAGE_DESCRIPTION}</p>
      <div className="w-[400px]">
        <form
          className="change-mantine-input-focus with-shadow font-light"
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <TextInput
            placeholder="name@example.com"
            className="mb-6"
            size="md"
            {...form.getInputProps("email")}
          />
          <Button
            color="var(--color-teal)"
            size="md"
            type="submit"
            loading={loading}
            fullWidth
          >
            {SIGNIN_PAGE_BUTTON_TEXT}
          </Button>
          <Divider label="OR" className="my-8" />
          <p className="text-center text-dimmed">
            {SIGNIN_PAGE_ALTERNATE_LINK_TITLE}{" "}
            <Link href="/signup" className="link font-normal">
              {SIGNIN_PAGE_ALTERNATE_LINK_TEXT}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
