"use client";

import { ColorSwatch } from "@prisma/client/edge";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AddWatchInput } from "@/app/_actions/add-watch";
import { AddWatch } from "@/components/AddWatch";
import { WatchIcon } from "@/components/WatchIcon";
import { ActionResponse } from "@/types";
import { HiPlus } from "react-icons/hi";

export interface Props {
  colorSwatches: ColorSwatch[];

  /* Server action to add the watch */
  action: (input: AddWatchInput) => Promise<ActionResponse>;
}

export const AddWatchModal = (props: Props) => {
  const { colorSwatches, action } = props;
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <div className="ms-20">
        <Button color="var(--color-teal)" leftSection={<HiPlus />} size="sm" onClick={open}>
          Add New
        </Button>
      </div>

      <Modal
        opened={opened}
        onClose={close}
        title="Add New Watch"
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 2.5,
        }}
        centered
      >
        <div className="flex-ic flex-col">
          <AddWatch
            action={action}
            colorSwatches={colorSwatches}
            watchPreview={colorSwatch => (
              <div className="center size-24 shadow-sm rounded-3xl border border-solid border-[--color-border]">
                <WatchIcon size={80} fill={colorSwatch.value} />
              </div>
            )}
            showNotification={true}
            onSubmitComplete={close}
          />
        </div>
      </Modal>
    </>
  );
};
