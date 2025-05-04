import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart, FileText, Settings, Users, Upload, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  isSidebarCollapsed: boolean;
}
const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
  isSidebarCollapsed
}: SidebarItemProps) => {
  return <Link to={href} className={cn("flex items-center gap-3 px-3 py-2 rounded-md transition-colors", isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}>
      <Icon className="h-5 w-5" />
      {!isSidebarCollapsed && <span>{label}</span>}
    </Link>;
};
export default function MainSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigation = [{
    icon: BarChart,
    label: "Dashboard",
    href: "/"
  }, {
    icon: FileText,
    label: "Templates",
    href: "/templates"
  }, {
    icon: Users,
    label: "Contatos",
    href: "/contacts"
  }, {
    icon: Settings,
    label: "Configurações",
    href: "/settings"
  }, {
    icon: Upload,
    label: "Importar",
    href: "/import"
  }];
  return <div className={cn("flex flex-col border-r border-border bg-card h-screen transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && <div className="flex items-center">
            <img src="/lovable-uploads/0e84b822-6807-468e-b2cd-46027e1fcabc.png" alt="Antecipar Brasil" className="h-8 w-auto max-w-[180px] object-fill" />
          </div>}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className={isCollapsed ? "mx-auto" : "ml-auto"}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-2 space-y-1">
        {navigation.map(item => <SidebarItem key={item.href} icon={item.icon} label={item.label} href={item.href} isActive={location.pathname === item.href} isSidebarCollapsed={isCollapsed} />)}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground">
        {!isCollapsed && <div>v1.0.0</div>}
      </div>
    </div>;
}