import { type FormEvent, forwardRef, useRef } from "react";
import { Alert, Loader, PinInput } from "@mantine/core";
import { GoAlert } from "react-icons/go";

export type Props = {
  description: string;
  value: string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void | Promise<void>;
  checking: boolean;
  error: boolean;
};

export const ValidateOtp = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { description, value, onChange, onComplete, checking, error } = props;

  const handleComplete = (value: string) => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  };

  // For server actions to work properly, the onComplete handler should be triggered via form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onComplete(value);
  };

  return (
    <>
      <h1 className="text-[56px] font-medium pb-2">
        Check your email for a code
      </h1>
      <p className="font-light mb-8">{description}</p>
      <div className="w-[400px]">
        <form
          className="change-mantine-input-focus with-shadow font-light"
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-col items-center">
            <PinInput
              size="lg"
              length={6}
              value={value}
              onChange={onChange}
              onComplete={handleComplete}
              ref={ref}
              disabled={checking}
              autoFocus
            />
            <div className="flex items-center my-5">
              {checking && (
                <>
                  <Loader size="xs" color="var(--color-dimmed)" />
                  <span className="ms-2 text-dimmed">Checking Code</span>
                </>
              )}

              {error && (
                <Alert
                  variant="light"
                  color="red"
                  styles={{
                    root: {
                      border: "1px solid var(--alert-color)",
                      paddingBlock: "var(--mantine-spacing-xs)",
                    },
                  }}
                  icon={<GoAlert />}
                >
                  That code wasn’t valid. Have another go!
                </Alert>
              )}
            </div>

            <p className="text-center text-dimmed my-8">
              Can’t find your code? Check your spam folder!
            </p>
          </div>
        </form>
      </div>
    </>
  );
});

ValidateOtp.displayName = "panicalarm/ValidateOtp";
