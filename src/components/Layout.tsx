import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  Home,
  CalendarDays,
  Monitor,
  Boxes,
  Library,
  History,
} from "lucide-react";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    "/": "Bem-vindo ao Sistema de Gestão de TI",
    "/planejamento": "Planejamento",
    "/painel": "Painel de Aulas",
    "/patrimonios": "Patrimônios",
    "/salas": "Salas",
    "/historico": "Histórico",
  };

  const sidebarWidth = sidebarOpen ? "16rem" : "5rem";

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* SIDEBAR */}
      <aside
        className={`h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Cabeçalho */}
        <div
          className={`p-4 border-b border-gray-200 flex items-center ${
            sidebarOpen ? "justify-between" : "justify-center"
          }`}
        >
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                TI
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">TQR</h1>
                <p className="text-xs text-gray-500">Sistema de Gestão</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-3 space-y-2 text-sm">
          <NavItem
            to="/"
            icon={<Home className="w-5 h-5" />}
            label="Início"
            open={sidebarOpen}
          />
          <NavItem
            to="/planejamento"
            icon={<CalendarDays className="w-5 h-5" />}
            label="Planejamento"
            open={sidebarOpen}
          />
          <NavItem
            to="/painel"
            icon={<Monitor className="w-5 h-5" />}
            label="Painel"
            open={sidebarOpen}
          />
          <NavItem
            to="/patrimonios"
            icon={<Boxes className="w-5 h-5" />}
            label="Patrimônios"
            open={sidebarOpen}
          />
          <NavItem
            to="/salas"
            icon={<Library className="w-5 h-5" />}
            label="Salas"
            open={sidebarOpen}
          />
          <NavItem
            to="/historico"
            icon={<History className="w-5 h-5" />}
            label="Histórico"
            open={sidebarOpen}
          />
        </nav>

        {/* Rodapé */}
        <footer className="p-3 text-center text-xs text-gray-400 border-t border-gray-200">
          {sidebarOpen ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-4 text-gray-500">
                <a
                  href="https://www.instagram.com/gf_herber/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500 transition-transform transform hover:scale-110"
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="https://github.com/gfherber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-transform transform hover:scale-110"
                >
                  <FaGithub size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/gabriel-herber/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-transform transform hover:scale-110"
                >
                  <FaLinkedin size={18} />
                </a>
              </div>
              <p>Desenvolvido por Gabriel Herber</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <FaInstagram size={16} className="hover:text-pink-500" />
              <FaGithub size={16} className="hover:text-gray-900" />
              <FaLinkedin size={16} className="hover:text-blue-600" />
              <p>©</p>
            </div>
          )}
        </footer>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col">
        {/* Header superior */}
        <header
          className="h-16 flex items-center border-b border-gray-200 bg-white shadow-sm px-6"
          style={{ marginLeft: sidebarOpen ? "0" : "0" }}
        >
          <h1 className="text-xl font-semibold text-gray-800">
            {pageTitles[location.pathname] || ""}
          </h1>
        </header>

        {/* Conteúdo renderizado pelas rotas */}
        <main className="flex-1 px-6 py-8 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

/* Componente NavItem */
function NavItem({
  to,
  icon,
  label,
  open,
}: {
  to: string;
  icon: JSX.Element;
  label: string;
  open: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-200 ${
          isActive && open
            ? "bg-blue-100 text-blue-700 font-medium"
            : "text-gray-700 hover:bg-blue-50"
        }`
      }
    >
      {icon}
      {open && <span className="whitespace-nowrap">{label}</span>}
    </NavLink>
  );
}
