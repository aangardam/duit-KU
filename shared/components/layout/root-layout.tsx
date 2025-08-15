"use client"

import { Toaster } from "sonner";

// import { SidebarProvider } from "../ui/sidebar";
// import { AppSidebar } from "./sidebar/app-sidebar";
import { motion } from "framer-motion";
import Header from "./header";
import Sidebar from "./sidebar/sidebar";
import { SidebarProvider } from "@/shared/contexts/sidebar-context";
import { useAuthRedirect } from "@/shared/hooks/use-auth-redirect";
import Loading from "../commons/loading/loading";


interface RootLayoutProps {
    children: React.ReactNode;
    title:string;
}

export function RootLayout(props: RootLayoutProps) {
    const { children, title } = props;
    const isLoading = useAuthRedirect();
    return (
        <>
            {isLoading ? (
                <Loading />
            ):(
                <SidebarProvider>
                    <div className="flex h-screen bg-slate-50 w-full">
                        {/* <AppSidebar /> */}
                        <Sidebar />
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <Header title={title} />
                            <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    className="space-y-4"
                                >
                                {children}
                                </motion.div>
                            </main>
                            <Toaster position="top-right" richColors  />
                        </div>
                    </div>
                </SidebarProvider>
            )}
        </>
        
    )
}