
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart, FileText, Settings, Users, Upload, Menu, Clock, LogOut, Smartphone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  isSidebarCollapsed: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
  isSidebarCollapsed,
  onClick
}: SidebarItemProps) => {
  if (href === "logout") {
    return (
      <button 
        onClick={onClick} 
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full text-left",
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        {!isSidebarCollapsed && <span>{label}</span>}
      </button>
    );
  }

  return (
    <Link to={href} className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    )}>
      <Icon className="h-5 w-5" />
      {!isSidebarCollapsed && <span>{label}</span>}
    </Link>
  );
};

export default function MainSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Sessão encerrada com sucesso");
    window.location.href = "/login";
  };
  
  const navigation = [
    { icon: BarChart, label: "Dashboard", href: "/" },
    { icon: FileText, label: "Templates", href: "/templates" },
    { icon: Users, label: "Contatos", href: "/contacts" },
    { icon: Clock, label: "Agendamento de Disparos", href: "/schedule-dispatch" },
    { icon: Smartphone, label: "Conectar WhatsApp", href: "/connect-whatsapp" },
    { icon: Settings, label: "Configurações", href: "/settings" },
    { icon: Upload, label: "Importar", href: "/import" },
  ];

  return (
    <div className={cn(
      "flex flex-col border-r border-border bg-card h-screen transition-all duration-300", 
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && <div className="font-semibold text-lg">Monitor de Disparos</div>}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-auto">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-2 space-y-1">
        {navigation.map(item => (
          <SidebarItem 
            key={item.href} 
            icon={item.icon} 
            label={item.label} 
            href={item.href} 
            isActive={location.pathname === item.href} 
            isSidebarCollapsed={isCollapsed} 
          />
        ))}
      </div>

      {/* Logout */}
      <div className="p-2 border-t border-border">
        <SidebarItem 
          icon={LogOut} 
          label="Sair" 
          href="logout" 
          isActive={false} 
          isSidebarCollapsed={isCollapsed} 
          onClick={handleLogout}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground">
        {!isCollapsed && <div>@Henrique062<br />Versão 1.2.0</div>}
      </div>
    </div>
  );
}
