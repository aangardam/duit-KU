"use client"

import Image from "next/image"
import { FaSignOutAlt } from "react-icons/fa"
import { Separator } from "../../ui/separator"
import useSidebarCustom from "@/shared/hooks/use-sidebar"
import SidebarMenu from "./sidebar-menu"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/shared/store/user.store"
import { useQueryClient } from "@tanstack/react-query"

const Sidebar = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore()
  const router = useRouter()
  const {
    sidebarOpen = true,
    setSidebarOpen,
    handleMouseEnter,
    handleMouseLeave,
    dataMenu,
  } = useSidebarCustom()

  const handleLogout = () => {
    setUser(null)
    queryClient.clear();
    localStorage.removeItem('user-storage')
    router.push('/login')
  }

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          fixed inset-y-0 left-0 z-30 
          flex flex-col
          bg-gradient-to-r from-[#001a33] to-[#002b4d] 
          text-white overflow-y-auto 
          transition-all duration-300 ease-in-out 
          scrollbar-hide lg:relative 
          ${sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0 lg:w-24"}
        `}
      >
        {/* Header */}
        <div className={`flex items-center p-6  ${!sidebarOpen ? "justify-center" : ""}`}>
            <div className="bg-white rounded-full p-1 w-10 h-10 flex items-center justify-center mr-2">
                <Image
                    src="/icon.png"
                    alt="logo"
                    width={50}
                    height={10}
                    className="object-contain"
                />
            </div>
            {sidebarOpen && (
                <h1 className="text-white font-semibold text-2xl whitespace-nowrap">dompet<span className="font-bold">KU</span></h1>
            )}
        </div>

        <Separator className="bg-white/10 my-1" />

        {/* Menu Section */}
        <div className="flex flex-col">
          {/* <span className="text-sm mb-2 font-semibold text-muted">List Menu</span> */}
          {dataMenu.map((item, index) => (
            <SidebarMenu key={index} menu={item} isOpen={sidebarOpen} />
          ))}
          {/* Render menu di sini */}
        </div>

        <div className="flex-1" /> {/* ⬅️ Push footer ke bawah */}

        {/* Logout */}
        <div className="w-full px-4 pb-6">
          <Separator className="bg-white/10 my-2" />
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 gap-3 rounded-md hover:bg-blue-600 transition-colors"
          >
            <FaSignOutAlt className="w-5 h-5 text-white" />
            {sidebarOpen && (
              <span className="text-sm md:text-base font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
