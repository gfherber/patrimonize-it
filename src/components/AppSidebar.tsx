import {
  LayoutDashboard,
  Package,
  DoorOpen,
  History,
  CalendarDays,
  Monitor,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

const menuItems = [
  { title: "Início", url: "/", icon: LayoutDashboard },
  { title: "Planejamento", url: "/planejamento", icon: CalendarDays },
  { title: "Painel", url: "/painel", icon: Monitor },
  { title: "Patrimônios", url: "/patrimonios", icon: Package },
  { title: "Salas", url: "/salas", icon: DoorOpen },
  { title: "Histórico", url: "/historico", icon: History },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r flex flex-col justify-between">
      {/* Header */}
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Patrimônio TI</h2>
            <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Conteúdo do menu */}
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Rodapé fixo com redes sociais */}
      <SidebarFooter className="border-t p-4">
        <div className="flex flex-col items-center justify-center gap-3 w-full">
          <div className="flex items-center justify-center gap-4 text-gray-500">
            <a
              href="https://instagram.com/SEU_USUARIO"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-transform transform hover:scale-110"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://github.com/SEU_USUARIO"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-transform transform hover:scale-110"
            >
              <FaGithub size={18} />
            </a>
            <a
              href="https://linkedin.com/in/SEU_USUARIO"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-transform transform hover:scale-110"
            >
              <FaLinkedin size={18} />
            </a>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Desenvolvido pelo Gabriel Herber
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
