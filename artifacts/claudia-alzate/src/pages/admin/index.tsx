import { useState } from "react";
import { useLocation } from "wouter";
import { useGetMe, getGetMeQueryKey, useLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link2, User as UserIcon, Settings, LogOut } from "lucide-react";
import logoPath from "@assets/image_1781908878316.png";

// Placeholder components, to be implemented
import { LinksManager } from "@/components/admin/links-manager";
import { IdentityManager } from "@/components/admin/identity-manager";
import { SettingsManager } from "@/components/admin/settings-manager";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"links" | "identity" | "settings">("links");

  const { data: user, isLoading, isError } = useGetMe({
    query: { 
      queryKey: getGetMeQueryKey(),
      retry: false
    }
  });

  const logoutMutation = useLogout();

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading...</div>;
  }

  if (isError || !user) {
    setLocation("/admin/login");
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setLocation("/admin/login");
      }
    });
  };

  return (
    <div className="min-h-[100dvh] bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col">
        <div className="p-6 flex flex-col items-center border-b border-sidebar-border">
          <img src={logoPath} alt="Logo" className="w-16 h-16 rounded-full mb-4" />
          <h2 className="font-serif text-lg text-sidebar-foreground">Admin Portal</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("links")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === "links" ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"}`}
          >
            <Link2 className="w-5 h-5" />
            <span className="font-medium">Manage Links</span>
          </button>
          <button 
            onClick={() => setActiveTab("identity")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === "identity" ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"}`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="font-medium">Brand Identity</span>
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === "settings" ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background/50 overflow-auto">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <h2 className="font-serif text-lg">Admin Portal</h2>
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="bg-transparent border border-border rounded p-2 text-sm"
          >
            <option value="links">Links</option>
            <option value="identity">Identity</option>
            <option value="settings">Settings</option>
          </select>
        </header>

        <div className="p-6 md:p-10 max-w-4xl mx-auto">
          {activeTab === "links" && <LinksManager />}
          {activeTab === "identity" && <IdentityManager />}
          {activeTab === "settings" && <SettingsManager />}
        </div>
      </main>
    </div>
  );
}
