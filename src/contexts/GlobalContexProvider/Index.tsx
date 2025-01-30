import React, { useState, createContext } from "react";

type GlobalContextType = {
  isWriteModalOpen: boolean;
  setIsWriteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalContext = createContext<{
  isWriteModalOpen: boolean;
  setIsWriteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>(null as unknown as GlobalContextType);

const GlobalContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  return (
    <GlobalContext.Provider value={{ isWriteModalOpen, setIsWriteModalOpen }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };
