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
} from "lucide-react";
import Image from "next/image";
import axios from "axios";

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
      <div
        className={`h-screen fixed left-0 top-0 ${
          open ? "w-64" : "w-20"
        } bg-gradient-to-b from-gray-900 to-black text-white transition-all duration-300 flex flex-col z-50 shadow-xl`}
      >
        {/* Toggle Button */}
        <button
          className="absolute top-4 right-[-40px] bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-all"
          onClick={() => setOpen(!open)}
        >
          <Menu size={20} className={`transition-transform ${!open ? 'rotate-0' : 'rotate-180'}`} />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center p-5 border-b border-gray-800">
          <Link href="/">
            {open ? (
              <Image
                src={"/cf-logo.jpg"}
                alt="logo"
                width={150}
                height={150}
                className="rounded-md"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">CF</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-6 px-3">
          {menuItems.map(({ text, icon, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={text}
                href={href}
                className={`flex items-center gap-3 p-3 my-1 rounded-lg transition-all ${
                  isActive 
                    ? "bg-blue-600 text-white font-medium shadow-md" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className={`${isActive ? "text-white" : "text-gray-400"}`}>{icon}</span>
                {open && <span>{text}</span>}
                {open && isActive && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Admin Info */}
        {admin && open && (
          <div className="px-4 py-3 border-t border-gray-800 mt-auto">
            <div className="text-xs text-gray-400">Logged in as:</div>
            <div className="text-white text-sm font-medium truncate">{admin.email}</div>
          </div>
        )}

        {/* Logout */}
        <div>
          <button
            onClick={() => handleLogout()}
            className="flex items-center gap-3 p-3 w-full text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all mx-3 my-2 rounded-lg"
          >
            <LogOut size={20} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </div>

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
