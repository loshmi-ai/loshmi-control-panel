import {
  ChevronDownIcon,
  ComponentIcon,
  LayoutDashboardIcon,
  SquareStackIcon,
  WandSparklesIcon,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@src/ui/components/collapsible";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@src/ui/components/sidebar";
import { designSystemComponentLinks } from "@src/ui/routes/design-system/navigation";
import type { DesignSystemComponentId } from "@src/ui/routes/design-system.types";

const overviewLink = {
  icon: LayoutDashboardIcon,
  path: "/design-system",
  title: "Overview",
};

type CustomComponentNavItem = {
  component: DesignSystemComponentId | "morpheus";
  disabled?: boolean;
  icon: LucideIcon;
  id: string;
  path?: string;
  title: string;
};

const customComponentLinks: CustomComponentNavItem[] = [
  ...designSystemComponentLinks.map((link) => ({
    component: link.id,
    icon: SquareStackIcon,
    id: link.id,
    path: link.path,
    title: link.title,
  })),
  {
    component: "morpheus",
    disabled: true,
    icon: WandSparklesIcon,
    id: "morpheus",
    title: "Morpheus",
  },
];

export function DesignSystemSidebar({
  activeComponent,
}: {
  activeComponent?: DesignSystemComponentId;
}) {
  const location = useLocation();
  const OverviewIcon = overviewLink.icon;

  return (
    <SidebarContent className="dark flex-none border-b border-white/10 pb-4 lg:w-64 lg:border-r lg:border-b-0 lg:pr-4">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={location.pathname === overviewLink.path}
                render={<Link to={overviewLink.path} />}
              >
                <OverviewIcon />
                <span>{overviewLink.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeComponent !== undefined}
                  render={<CollapsibleTrigger />}
                >
                  <ComponentIcon />
                  <span>Components</span>
                  <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {customComponentLinks.map((item) => {
                      const Icon = item.icon;

                      return (
                        <SidebarMenuSubItem key={item.id}>
                          {item.disabled || !item.path ? (
                            <SidebarMenuSubButton
                              aria-disabled="true"
                              render={<span />}
                            >
                              <Icon />
                              <span>{item.title}</span>
                            </SidebarMenuSubButton>
                          ) : (
                            <SidebarMenuSubButton
                              isActive={item.component === activeComponent}
                              render={<Link to={item.path} />}
                            >
                              <Icon />
                              <span>{item.title}</span>
                            </SidebarMenuSubButton>
                          )}
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Collapsible>
    </SidebarContent>
  );
}
