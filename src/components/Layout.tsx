
import { ReactNode } from "react";
import Header from "./Header";
import TutorialOverlay from "./TutorialOverlay";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <footer className="py-4 px-6 border-t border-gray-200 bg-white bg-opacity-70">
          <p className="text-center text-sm text-gray-500">
            © 2025 Plaster Flow Commander - Tableau de bord de gestion de production
          </p>
        </footer>
      </div>
      <TutorialOverlay />
    </div>
  );
}
