
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import VersionToggle from "./VersionToggle";
import TutorialOverlay from "./TutorialOverlay";
import { useVersion } from "@/contexts/VersionContext";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { version, setVersion } = useVersion();
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <Header />
        <div className="flex justify-end p-2 pr-6">
          <VersionToggle 
            currentVersion={version} 
            onToggle={setVersion} 
          />
        </div>
        <main className="p-6">
          {children}
        </main>
        <footer className="py-4 px-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © 2025 Plaster Flow Commander - Tableau de bord de gestion de production
          </p>
        </footer>
      </div>
      <TutorialOverlay />
    </div>
  );
}
