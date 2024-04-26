"use client";

import { createContext, useState } from "react";
import { readLocalStorageValue, useLocalStorage } from "@mantine/hooks";

export interface IActiveWatchContext {
  activeWatchId: string;
  setActiveWatchId: (state: string) => void;
}

export const ActiveWatchContext = createContext<IActiveWatchContext>({
  activeWatchId: "",
  setActiveWatchId: () => {},
});

export const ActiveWatchProvider = ({ children }: { children: React.ReactNode }) => {
  const STORAGE_KEY = "pa__active-watch";
  const [_, set] = useLocalStorage({
    key: STORAGE_KEY,
  });

  const [activeWatchId, setActiveWatchId] = useState<string>(
    readLocalStorageValue({ key: STORAGE_KEY })
  );

  const setActiveWatchIdWithStore = (state: string) => {
    set(state);
    setActiveWatchId(state);
  };

  return (
    <ActiveWatchContext.Provider
      value={{ activeWatchId, setActiveWatchId: setActiveWatchIdWithStore }}
    >
      {children}
    </ActiveWatchContext.Provider>
  );
};
