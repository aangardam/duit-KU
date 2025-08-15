"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import clsx from "clsx"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar"

type MenuItem = {
  title: string
  url: string
  icon?: LucideIcon
  items?: MenuItem[]
}

export function NavMain({ items }: { items: MenuItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>DompetKU</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isParentActive =
            pathname === item.url ||
            pathname.startsWith(item.url) ||
            item.items?.some(
              (sub) =>
                pathname === sub.url ||
                sub.items?.some((child) => pathname === child.url)
            )

          return item.items && item.items.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isParentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={clsx(isParentActive && "bg-muted text-primary")}
                  >
                    {item.icon && <item.icon />}
                    <span className="text-md">{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const isSubActive =
                        pathname === subItem.url ||
                        subItem.items?.some((child) => pathname === child.url)

                      return subItem.items && subItem.items.length > 0 ? (
                        <Collapsible
                          key={subItem.title}
                          asChild
                          defaultOpen={isSubActive}
                          className="group/collapsible"
                        >
                          <SidebarMenuSubItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuSubButton
                                className={clsx(
                                  isSubActive && "bg-muted text-primary"
                                )}
                              >
                                <span className="text-md">{subItem.title}</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuSubButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {subItem.items.map((child) => {
                                  const isChildActive = pathname === child.url
                                  return (
                                    <SidebarMenuSubItem key={child.title}>
                                      <SidebarMenuSubButton asChild>
                                        <Link
                                          href={child.url}
                                          className={clsx(
                                            "block w-full text-left",
                                            isChildActive &&
                                              "bg-muted text-primary"
                                          )}
                                        >
                                          <span className="text-md">{child.title}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  )
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuSubItem>
                        </Collapsible>
                      ) : (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subItem.url}
                              className={clsx(
                                "block w-full text-left",
                                isSubActive && "bg-muted text-primary"
                              )}
                            >
                              <span className="text-md">{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link
                  href={item.url}
                  className={clsx(
                    "flex items-center w-full gap-2",
                    pathname === item.url && "bg-muted text-primary"
                  )}
                >
                  {item.icon && <item.icon />}
                  <span className="text-md">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
