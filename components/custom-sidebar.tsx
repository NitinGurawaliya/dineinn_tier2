"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Home, Edit, QrCode, User2, Menu, X, Search, MenuIcon, MenuSquare, HomeIcon, View, GitGraph, LineChart, UserRoundSearchIcon, LogOut, Image } from "lucide-react";

type NavItem = {
  section: string;
  label: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {section: "home", label: "Home", icon: HomeIcon},
  { section: "edit-menu", label: "Edit your Menu", icon: Edit },
  { section: "generate-qr", label: "Manage QR Code", icon: QrCode },
  { section: "edit-profile", label: "Edit your Profile", icon: User2 },
  {section:"analytics",label:"View Analytics",icon:LineChart},
  {section:"my-customers",label:"My Customers",icon:UserRoundSearchIcon},
  {section:"gallery",label:"Gallery",icon:Image}
];

export function CustomSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section") || "";

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleNavigation = (section: string) => {
    router.push(`?section=${section}`, { scroll: false }); // Updates the URL without full page reload
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call logout API
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Redirect to home page
        router.push("/");
      } else {
        console.error("Logout failed");
        // Still redirect to home page even if logout API fails
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect to home page even if logout fails
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <button className="fixed top-6 text-black right-4 z-50 md:hidden" onClick={toggleSidebar} aria-label="Toggle Sidebar">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold">DASHBOARD</h1>
          </div>
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.section}>
                  <button
                    onClick={() => handleNavigation(item.section)}
                    className={`flex items-center w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                      activeSection === item.section
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="px-4 py-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center w-full text-left px-4 py-2 rounded-md transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
