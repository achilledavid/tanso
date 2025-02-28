import React, { createContext, useContext, useState, PropsWithChildren } from 'react';

type SelectedPadContextType = {
  selectedPad: Pad | null;
  selectPad: (pad: Pad) => void;
  clearSelectedPad: () => void;
  isSelected: (padId: Pad["id"]) => boolean;
}

const SelectedPadContext = createContext<SelectedPadContextType | undefined>(undefined);

export function SelectedPadProvider({ children }: PropsWithChildren) {
  const [selectedPad, setSelectedPad] = useState<Pad | null>(null);

  const selectPad = (pad: Pad) => {
    setSelectedPad(pad);
  };

  const clearSelectedPad = () => {
    setSelectedPad(null);
  };

  const isSelected = (padId: Pad["id"]) => {
    return selectedPad?.id === padId;
  };

  const value = {
    selectedPad,
    selectPad,
    clearSelectedPad,
    isSelected,
  };

  return (
    <SelectedPadContext.Provider value={value}>
      {children}
    </SelectedPadContext.Provider>
  );
}

export function useSelectedPad() {
  const context = useContext(SelectedPadContext);

  if (context === undefined) {
    throw new Error('useSelectedPad doit être utilisé à l\'intérieur d\'un SelectedPadProvider');
  }

  return context;
}
