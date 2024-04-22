import { ReactNode, useState } from "react";
import { ColorSwatch } from "@prisma/client/edge";
import {
  TextInput,
  Group,
  CheckIcon,
  Button,
  Tooltip,
  ColorSwatch as MantineColorSwatch,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AddWatchInput } from "@/app/_actions/add-watch";
import {
  ERROR_INVALID_WATCH_CODE,
  ERROR_INVALID_WATCH_NAME,
  NOTIFICATION_WATCH_ADDED,
} from "@/constants/app-strings";
import { ActionResponse } from "@/types";
import { maskCode } from "@/utils/mask-code";
import { sb } from "@/utils/string-builder";
import { GoAlert } from "react-icons/go";

export interface Props {
  /* Server action to save the watch */
  action: (input: AddWatchInput) => Promise<ActionResponse>;

  /* Available watch colors */
  colorSwatches: ColorSwatch[];

  /* Render a watch preview with the selected color swatch */
  watchPreview?: (colorSwatch: ColorSwatch) => ReactNode;

  /* Show a notification when watch is successfully added */
  showNotification?: boolean;

  /* Any effects to run after the form submission handler completes execution */
  onSubmitComplete?: () => void;
}

export const AddWatch = (props: Props) => {
  const { action, colorSwatches, watchPreview, showNotification = true, onSubmitComplete } = props;

  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [selectColorSwatch, setSelectedColorSwatch] = useState(colorSwatches[0]);

  const form = useForm({
    initialValues: {
      code: "",
      name: "",
    },
    validate: {
      code: value => (value.trim().length !== 12 ? ERROR_INVALID_WATCH_CODE : null),
      name: value => (value.trim().length < 3 ? ERROR_INVALID_WATCH_NAME : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const resp = await action({ ...values, colorSwatchId: selectColorSwatch.id });
    setLoading(false);

    if (!resp.ok) {
      setError(resp.error);
      return;
    }

    if (showNotification) {
      notifications.show({
        message: sb(NOTIFICATION_WATCH_ADDED, { code: maskCode(values.code) }),
        withCloseButton: false,
      });
    }

    if (typeof onSubmitComplete === "function") {
      onSubmitComplete();
    }
  };

  return (
    <>
      {typeof watchPreview === "function" && watchPreview(selectColorSwatch)}
      <form
        className="w-full mt-8 change-mantine-input-focus"
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <TextInput
          placeholder="Watch Code - xxx-xxxx-xxx"
          className="mb-4"
          maxLength={12}
          size="md"
          {...form.getInputProps("code")}
        />
        <TextInput
          placeholder="Mom's Watch"
          className="mb-6"
          size="md"
          {...form.getInputProps("name")}
        />
        <Group className="mb-8">
          <label className="mr-auto font-light">Give it a cool color</label>
          {colorSwatches.map((cs, idx) => (
            <Tooltip label={cs.name} key={idx} arrowSize={6} color={cs.value} withArrow>
              <MantineColorSwatch
                component="button"
                type="button"
                color={cs.value}
                onClick={() => setSelectedColorSwatch(cs)}
              >
                {cs.id === selectColorSwatch.id && (
                  <CheckIcon style={{ width: 12, height: 12 }} color="white" />
                )}
              </MantineColorSwatch>
            </Tooltip>
          ))}
        </Group>
        <Button
          className="mt-4"
          color="var(--color-teal)"
          size="md"
          type="submit"
          loading={loading}
          fullWidth
        >
          Add Watch
        </Button>
      </form>

      {error && (
        <div className="w-full mt-8">
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
            {error}
          </Alert>
        </div>
      )}
    </>
  );
};
