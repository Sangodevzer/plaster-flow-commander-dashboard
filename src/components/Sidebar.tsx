import { useState } from "react";
import { LayoutDashboard, FlaskRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type NavItem = {
  name: string;
  icon: React.FC<{ className?: string }>;
  href: string;
  current: boolean;
};

export default function Sidebar() {
  const [navItems, setNavItems] = useState<NavItem[]>([
    { name: "Tableau de Bord", icon: LayoutDashboard, href: "#overview", current: true },
    { name: "Simulateur", icon: FlaskRound, href: "#simulator", current: false },
  ]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleClick = (clickedItem: NavItem) => {
    setNavItems(navItems.map(item => ({
      ...item,
      current: item.name === clickedItem.name
    })));
  };

  return (
    <div 
      className={cn(
        "flex flex-col bg-factory-darkBlue text-white transition-all duration-300 h-screen sticky top-0",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-blue-800">
        {!isCollapsed && (
          <h2 className="font-bold text-lg">Plaster Flow</h2>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-2 rounded-md hover:bg-blue-800 transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => handleClick(item)}
              className={cn(
                "flex items-center px-3 py-3 rounded-md transition-colors",
                item.current
                  ? "bg-factory-blue text-white"
                  : "text-gray-300 hover:bg-blue-800 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "mr-3")} />
              {!isCollapsed && <span>{item.name}</span>}
            </a>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-blue-800">
        {!isCollapsed && (
          <p className="text-xs text-gray-300">Plaster Flow Commander v1.0</p>
        )}
      </div>
    </div>
  );
}
