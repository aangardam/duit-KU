import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb"
import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"
import { Home, Menu, PanelLeftIcon } from "lucide-react"
import React from "react"
import { useSidebarContex } from "@/shared/contexts/sidebar-context"

type HeaderProps = {
    title?: string
  }
  
const Header = ({ title }: HeaderProps) => {
    const { toggleSidebar } = useSidebarContex()
    const pathName = usePathname()

    let segments: string[] = []
    if (pathName !== "/") {
        segments = pathName.split("/").filter(Boolean)
    } 

    const detailIndex = segments.indexOf("detail")
    if (detailIndex !== -1 && segments.length > detailIndex + 1) {
        segments = segments.slice(0, detailIndex + 1) // keep up to "detail"
    }

    const formatSegment = (segment: string) =>
        segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    return (
      <header className="bg-gray-100 border-b px-4 py-3 flex flex-cols justify-between gap-2 sticky top-0 z-10">
        <div className="flex justify-start text-sm text-gray-500 gap-1">
            <button
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {/* <Menu className="h-5 w-5" /> */}
              <PanelLeftIcon />
            </button>
            <Separator className="my-1" orientation="vertical"/>
        </div>
        <div className="flex flex-col w-full">
            
          <div className="flex items-center gap-2 mt-2 text-md flex-wrap">
            <Breadcrumb>
              <BreadcrumbList>
                {/* Always show Home as the first breadcrumb */}
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="inline-flex items-center gap-1">
                    <Home className="h-4 w-4 text-gray-600" />
                    <span>Home</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {/* If not root, show separators and additional segments */}
                {segments.length > 0 &&
                  segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const afterHome = index === 0;
                    const href = "/" + segments.slice(0, index + 1).join("/");
                    // console.log(afterHome, isLast, segment, index, href);
                    return (
                      <React.Fragment key={href}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {isLast || afterHome ? (
                            <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={href}>{formatSegment(segment)}</BreadcrumbLink>
                          )}
                          {/* <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage> */}
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

        </div>

      </header>
    )
}

export default Header