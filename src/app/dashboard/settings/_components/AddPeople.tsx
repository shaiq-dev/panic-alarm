"use client";

import React from "react";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classNames from "classnames";

const People = [
  { name: "Additi Singh", pending: true },
  { name: "Shaiq Kar", pending: true },
  { name: "Rohan Reddy", pending: true },
  { name: "Kalpaj", pending: true },
];

export const AddPeople = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <div className="flex flex-col">
        <h3 className="heading">Add People</h3>
        <p className="text-sm text-dimmed text-justify">
          You can add up to 5 people to receive notifications for events related to this watch.
          These individuals will receive alerts via email but will not have access to your dashboard
          or any other data. Their access is limited to receiving event notifications only.
        </p>
        {/* No People */}
        {/* <div className="flex-ic flex-col justify-center border def-border p-4 rounded mt-4">
          <Image src={NoPeopleAddedIcon} alt="No People" height={56} />
          <span className="py-3 font-medium">You haven't invited any people yet</span>
          <Button className="mt-4" color="var(--color-teal)" size="sm" onClick={open}>
            Add People
          </Button>
        </div> */}
        {/* Has People */}
        <div className="mt-4">
          {People.map((person, idx) => {
            const cn = classNames("flex-ic justify-between border def-border p-4", {
              "!border-t-0": idx !== 0,
              "rounded-t": idx === 0,
              "rounded-b": idx === People.length - 1,
            });

            return (
              <div className={cn} key={idx}>
                <div className="text-base font-medium leading-none">
                  {person.name}
                  <div className="text-sm text-dimmed font-light">
                    {person.pending && `Awaiting ${person.name.split(" ")[0]}'s response`}
                  </div>
                </div>
                <div className="text-sm text-dimmed font-light">Pending Invite</div>
                <div className="text-sm text-dimmed font-light">Remove</div>
              </div>
            );
          })}
        </div>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 2.5,
        }}
        title="Add People"
        centered
      ></Modal>
    </>
  );
};
