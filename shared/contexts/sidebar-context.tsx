"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type SidebarContextType = {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  isHovering: boolean
  setIsHovering: (hover: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <SidebarContext.Provider value={{
      sidebarOpen,
      toggleSidebar,
      setSidebarOpen,
      isHovering,
      setIsHovering
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebarContex() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
