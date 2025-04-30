"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Video,
  Bell,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  User,
  Shield,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { motion } from 'framer-motion';

const menuItems = [
  { text: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/" },
  { text: "Users", icon: <Users size={20} />, href: "/users" },
  { text: "Submissions", icon: <Video size={20} />, href: "/videos" },
  { text: "Notifications", icon: <Bell size={20} />, href: "/notifications" },
  { text: "Profile", icon: <Settings size={20} />, href: "/profile" },
];

const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [admin, setAdmin] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Get admin details from localStorage
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // Automatically close sidebar on medium screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setOpen(false); // Auto-close on medium screens
      }
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      localStorage.removeItem("admin");
      router.push("/login");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Fixed */}
      <motion.div
        initial={{ x: -20, opacity: 0.8 }}
        animate={{ x: 0, opacity: 1 }}
        className={`h-screen fixed left-0 top-0 ${
          open ? "w-64" : "w-20"
        } bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white transition-all duration-300 flex flex-col z-50 border-r border-gray-800/50 backdrop-blur-sm`}
      >
        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-[-40px] bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-all"
          onClick={() => setOpen(!open)}
        >
          <Menu size={20} className={`transition-transform ${!open ? 'rotate-0' : 'rotate-180'}`} />
        </motion.button>

        {/* Logo */}
        <div className="flex items-center justify-center p-5 border-b border-gray-800/50">
          <Link href="/">
            {open ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Image
                  src={"/cf-logo.jpg"}
                  alt="logo"
                  width={150}
                  height={150}
                  className="rounded-md"
                />
              </motion.div>
            ) : (
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/20"
              >
                <span className="text-xl font-bold">CF</span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-6 px-3 overflow-y-auto scrollbar-hide">
          {menuItems.map(({ text, icon, href }, index) => {
            const isActive = pathname === href;
            return (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 + 0.1 }}
              >
                <Link
                  href={href}
                  className={`flex items-center gap-3 p-3 my-2 rounded-xl transition-all ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white font-medium shadow-md shadow-blue-900/20" 
                      : "text-gray-300 hover:bg-gray-800/70 hover:text-white"
                  }`}
                >
                  <span className={`${isActive ? "text-white" : "text-gray-400"}`}>{icon}</span>
                  {open && <span className="font-medium">{text}</span>}
                  {open && isActive && (
                    <motion.div 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-auto"
                    >
                      <ChevronRight size={16} />
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Admin Info */}
        {admin && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-4 py-4 mt-auto ${open ? 'border-t border-gray-800/50 bg-gray-900/80' : 'flex justify-center'} backdrop-blur-sm`}
          >
            {open ? (
              <>
                <div className="text-xs text-gray-400 mb-1">Logged in as:</div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium truncate">{admin.email}</div>
                    <div className="text-xs text-blue-400">Administrator</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            )}
          </motion.div>
        )}

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleLogout()}
          className={`flex items-center gap-3 p-3 mx-3 my-3 rounded-xl transition-all ${
            open 
              ? "bg-gradient-to-r from-red-900/40 to-red-800/40 text-red-400 hover:from-red-900/60 hover:to-red-800/60" 
              : "justify-center text-red-400 hover:bg-red-900/30"
          }`}
        >
          <LogOut size={20} />
          {open && <span className="font-medium">Logout</span>}
        </motion.button>
      </motion.div>

      {/* Main Content - Adjust based on sidebar */}
      <main
        className={`flex-1 p-6 bg-gradient-to-br from-gray-900 to-black transition-all duration-300 overflow-x-hidden ${
          open ? "lg:ml-64 md:ml-20 ml-20" : "ml-20"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
