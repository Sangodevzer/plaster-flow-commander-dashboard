
import { createContext, useContext, useState, ReactNode } from "react";

type Version = "v1" | "v2";

interface VersionContextType {
  version: Version;
  setVersion: (version: Version) => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

const defaultColors = {
  v1: {
    primary: "#1A73E8",     // Factory blue
    secondary: "#FFA000",   // Factory amber
    accent: "#F44336",      // Factory red
    background: "#F5F5F5",  // Light gray
  },
  v2: {
    primary: "#8B5CF6",     // Saint-Gobain blue (purple)
    secondary: "#D946EF",   // Saint-Gobain secondary (pink)
    accent: "#F97316",      // Saint-Gobain accent (orange)
    background: "#F1F0FB",  // Light soft gray
  }
};

const VersionContext = createContext<VersionContextType | undefined>(undefined);

export function VersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<Version>("v1");
  
  const colors = defaultColors[version];
  
  return (
    <VersionContext.Provider value={{ version, setVersion, colors }}>
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
