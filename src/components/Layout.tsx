
import { ReactNode } from "react";
import Header from "./Header";
import TutorialOverlay from "./TutorialOverlay";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
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
