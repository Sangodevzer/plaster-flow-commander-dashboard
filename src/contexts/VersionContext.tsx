
import { createContext, useContext, ReactNode } from "react";

interface VersionContextType {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

const defaultColors = {
  primary: "#8B5CF6",     // Saint-Gobain blue (purple)
  secondary: "#D946EF",   // Saint-Gobain secondary (pink)
  accent: "#F97316",      // Saint-Gobain accent (orange)
  background: "#F1F0FB",  // Light soft gray
};

const VersionContext = createContext<VersionContextType | undefined>(undefined);

export function VersionProvider({ children }: { children: ReactNode }) {
  return (
    <VersionContext.Provider value={{ colors: defaultColors }}>
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error("useVersion must be used within a VersionProvider");
  }
  return context;
}
