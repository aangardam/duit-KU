
import { useSidebarContex } from "../contexts/sidebar-context"

const useSidebarCustom = () => {
    const { sidebarOpen, setSidebarOpen, isHovering, setIsHovering } = useSidebarContex();

    const handleMouseEnter = () => {
        
        if (!sidebarOpen) {
          setIsHovering(true)
          setSidebarOpen(true)
        }
    }
    
    const handleMouseLeave = () => {
        if (isHovering) {
            setIsHovering(false)
            setSidebarOpen(false)
        }
    }

    const dataMenu = [
        {
            id: 1,
            name: "Dashboard",
            url: "/dashboard",
            icon: "BsBarChartLineFill",
            parentId: 0,
            subMenu: []
        },
        {
            id: 2,
            name: "Master",
            url: "#",
            icon: "BsHddStackFill",
            parentId: 0,
            subMenu: [
                {
                    id: 3,
                    name: "Wallets",
                    url: "/master/wallets",
                    icon: "BsFillWalletFill",
                    parentId: 2,
                    subMenu: []
                },
                {
                    id: 4,
                    name: "Budgeting",
                    url: "/master/budgeting",
                    icon: "BsCoin",
                    parentId: 2,
                    subMenu: []
                },
                {
                    id: 5,
                    name: "Category",
                    url: "/master/category",
                    icon: "BsTags",
                    parentId: 2,
                    subMenu: []
                }
            ]
        },
        {
            id: 6,
            name: "Transactions",
            url: "/transactions",
            icon: "BsCartFill",
            parentId: 0,
            subMenu: []
        }
    ];


    return {
        sidebarOpen, 
        setSidebarOpen,
        handleMouseEnter,
        handleMouseLeave,
        dataMenu
    }
}

export default useSidebarCustom