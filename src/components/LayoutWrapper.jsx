"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Video,
  Bell,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";

const menuItems = [
  { text: "Dashboard", icon: <LayoutDashboard />, href: "/" },
  { text: "Users", icon: <Users />, href: "/users" },
  { text: "Videos", icon: <Video />, href: "/videos" },
  { text: "Notifications", icon: <Bell />, href: "/notifications" },
  { text: "Settings", icon: <Settings />, href: "/settings" },
];

const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();

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
          open ? "w-60" : "w-20"
        } bg-black text-white transition-all duration-300 flex flex-col z-50 py-6`}
      >
        {/* Toggle Button (Always Visible) */}
        <button
          className="absolute top-4 right-[-45px] bg-gray-800 p-2 rounded-full shadow-md"
          onClick={() => setOpen(!open)}
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center p-4">
          <Link href="/">
            {open && (
              <Image
                src={"/cf-logo.jpg"}
                alt="logo"
                width={150}
                height={150}
              />
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          {menuItems.map(({ text, icon, href }) => (
            <Link
              key={text}
              href={href}
              className="flex items-center gap-4 p-3 hover:bg-gray-700 transition"
            >
              <span className="text-xl">{icon}</span>
              {open && <span>{text}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto">
      <button
        onClick={() => handleLogout()}
        className="flex items-center gap-4 p-3 text-red-500 w-full hover:bg-red-900 transition"
      >
        <LogOut size={24} />
        {open && <span>Logout</span>}
      </button>
    </div>
      </div>

      {/* Main Content - Adjust based on sidebar */}
      <main
        className={`flex-1 p-6 bg-gradient-to-br from-gray-900 to-black transition-all duration-300 overflow-x-hidden ${
          open ? "lg:ml-[240px] md:ml-[80px] ml-[80px]" : "ml-[80px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
