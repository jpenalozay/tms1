import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex h-screen w-full bg-slate-100 dark:bg-[#020617] overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar toggleSidebar={() => setCollapsed(!collapsed)} />
        <main className="flex-1 relative overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
