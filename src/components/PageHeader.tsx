import { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white" style={{ marginTop: "-0.5px" }}>
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
