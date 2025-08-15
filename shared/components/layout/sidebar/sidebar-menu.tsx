import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as BsIcons from 'react-icons/bs';

type SidebarMenuItem = {
  name: string;
  url?: string;
  subMenu?: SidebarMenuItem[];
  icon?: string;
  parent?: number;
};

type SidebarMenuProps = {
  menu: SidebarMenuItem;
  isOpen: boolean;
};

const SidebarMenu = ({ menu, isOpen }: SidebarMenuProps) => {
  const currentPath = usePathname();
  const [subMenuVisible, setsubMenuVisible] = useState<{ [key: string]: boolean }>({});

  const iconComponents: { [key: string]: React.ElementType } = BsIcons;

  const getIconByName = (name: string): React.ElementType => iconComponents[name] || null;

  const renderIconBox = (iconName?: string) => {
    const nameIcon = iconName || 'BsFillGridFill';
    const IconComponent = getIconByName(nameIcon);
    return IconComponent ? <IconComponent className="text-white w-7 h-7" /> : null;
  };

  const toggleVisibility = (path: string) => {
    setsubMenuVisible((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const hasActiveSubMenu = (item: SidebarMenuItem): boolean => {
    if (!item.subMenu) return false;
    return item.subMenu.some(
      (sub) =>
        sub.url === currentPath ||
        (sub.subMenu && hasActiveSubMenu(sub))
    );
  };

  useEffect(() => {
    const initVisibility: { [key: string]: boolean } = {};

    const checkAndSetVisibility = (item: SidebarMenuItem, path: string) => {
      if (hasActiveSubMenu(item)) {
        initVisibility[path] = true;
      }
      item.subMenu?.forEach((subItem, subIndex) =>
        checkAndSetVisibility(subItem, `${path}-${subIndex}`)
      );
    };

    checkAndSetVisibility(menu, '0');
    setsubMenuVisible(isOpen ? initVisibility : {});
  }, [currentPath, isOpen, menu]);

  const renderMenuItem = (item: SidebarMenuItem, path: string) => {
    const isActive = item.url === currentPath;

    const wrapperClass = `
      mt-3 relative transition 
      ${isOpen ? 'px-3 py-1' : 'px-1 py-1'} 
      ${isActive ? 'bg-blue-600 rounded-lg' : ''} 
      group
    `;

    const contentClass = `
      flex items-center justify-between w-full rounded-md transition-colors 
      hover:bg-blue-600 px-2 py-2 cursor-pointer
    `;

    return (
      <div key={path} className={`${wrapperClass} group relative mt-2 items-center px-3 py-1`}>
        <div
          className={contentClass}
          onClick={() => {
            if (item.subMenu && item.subMenu.length > 0) {
              toggleVisibility(path);
            }
          }}
        >
          {item.subMenu && item.subMenu.length > 0 ? (
            <div className="flex items-center space-x-5">
              {renderIconBox(item.icon)}
              <h1
                className={`text-white text-sm md:text-lg font-medium cursor-pointer w-full ${
                  isOpen ? '' : 'hidden'
                }`}
              >
                {item.name}
              </h1>
            </div>
          ) : (
            <Link href={item.url || '#'}>
              <div className="flex items-center space-x-5">
                {renderIconBox(item.icon)}
                <h1
                  className={`text-white text-sm md:text-lg font-medium cursor-pointer w-full ${
                    isOpen ? '' : 'hidden'
                  }`}
                >
                  {item.name}
                </h1>
              </div>
            </Link>
          )}
          {item.subMenu && item.subMenu.length > 0 && isOpen && (
            <ChevronRight
              className={`duration-300 text-white text-sm md:text-lg transition-transform ${
                subMenuVisible[path] ? 'rotate-90' : ''
              }`}
            />
          )}
        </div>

        {item.subMenu && item.subMenu.length > 0 && (
          <motion.ul
            initial={false}
            animate={{
              height: subMenuVisible[path] ? 'auto' : 0,
              opacity: subMenuVisible[path] ? 1 : 0,
            }}
            transition={{
              duration: 0.5,
              ease: [0.42, 0, 0.58, 1],
            }}
            className="overflow-hidden ml-3"
          >
            {item.subMenu.map((subItem, subIndex) => (
              <motion.li
                key={`${path}-${subIndex}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="cursor-pointer"
              >
                {renderMenuItem(subItem, `${path}-${subIndex}`)}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    );
  };

  return <div className="px-0 md:px-3 select-none">{renderMenuItem(menu, '0')}</div>;
};

export default SidebarMenu;
