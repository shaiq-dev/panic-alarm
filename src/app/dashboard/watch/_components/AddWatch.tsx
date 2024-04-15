"use client";

import { Button, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { maskCode } from "@/utils/mask-code";
import { HiPlus } from "react-icons/hi";

export const AddWatch = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      code: "",
      name: "",
    },
    validate: {
      code: value =>
        value.trim().length !== 12 ? "Watch code should be exact 12 characters" : null,
      name: value =>
        value.trim().length < 5
          ? "Watch name should be atleast 5 characters and may not start or end with space"
          : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    // action(values);
    // const res = await addWatch({ fieldError: {} }, values);
    // console.log(res);

    // if (res.fieldError.watch) {
    //   form.setFieldError("code", res.fieldError.watch);
    // }

    form.reset();
    close();
    notifications.show({
      message: `Watch ${maskCode(values.code)} added successfully`,
      withCloseButton: false,
    });
  };

  return (
    <>
      <Button color="var(--color-teal)" leftSection={<HiPlus />} size="xs" onClick={open}>
        Add New
      </Button>

      <Modal
        opened={opened}
        onClose={() => {
          close();
          form.reset();
        }}
        title="Add New Watch"
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 2.5,
        }}
        centered
      >
        <form className="change-mantine-input-focus" onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Watch Code"
            placeholder="xxx-xxxx-xxx"
            className="mb-4"
            maxLength={12}
            {...form.getInputProps("code")}
          />
          <TextInput
            label="Watch Name"
            placeholder="My cool watch"
            className="mb-4"
            {...form.getInputProps("name")}
          />
          <div className="flex justify-end">
            <Button color="var(--color-teal)" size="xs" type="submit">
              Add Watch
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
