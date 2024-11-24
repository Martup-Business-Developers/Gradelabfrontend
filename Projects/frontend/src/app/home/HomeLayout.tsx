"use client";
import { useState } from 'react';
import { FiHome, FiFileText, FiUsers, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SidebarLink = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link href={href} className={`sidebar-link ${isActive ? 'active' : ''}`}>
      <Icon className="w-5 h-5 mr-3" />
      <span>{children}</span>
    </Link>
  );
};

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[--background]">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2">
          <FiMenu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">GradeLab</h1>
        <div className="w-8" /> {/* Spacer for alignment */}
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen transition-transform duration-300
        lg:translate-x-0 lg:w-64 
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
      `}>
        <div className="h-full bg-white border-r flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h1 className="text-xl font-bold">GradeLab</h1>
            <button 
              className="lg:hidden p-2" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            <SidebarLink href="/home/dashboard" icon={FiHome}>
              Dashboard
            </SidebarLink>
            <SidebarLink href="/home/evaluators" icon={FiFileText}>
              Evaluators
            </SidebarLink>
            <SidebarLink href="/home/classes" icon={FiUsers}>
              Classes
            </SidebarLink>
          </nav>

          {/* User Section */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FiUser className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-500">john@example.com</p>
              </div>
            </div>
            <div className="space-y-2">
              <Link href="/settings" className="sidebar-link">
                <FiSettings className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </Link>
              <button 
                onClick={() => {/* handle logout */}} 
                className="sidebar-link w-full text-left text-red-600 hover:bg-red-50"
              >
                <FiLogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        transition-all duration-300
        lg:ml-64 min-h-screen
        ${isSidebarOpen ? 'ml-64' : 'ml-0'}
      `}>
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default HomeLayout; 