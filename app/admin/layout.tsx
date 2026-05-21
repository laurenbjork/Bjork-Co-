'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from '@/app/lib/auth';
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  ShoppingBag,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Mail,
  Inbox,
  Megaphone,
  Instagram,
  Ruler
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/collections', label: 'Collections', icon: FolderOpen },
  { href: '/admin/categories', label: 'Categories', icon: ShoppingBag },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { href: '/admin/social/instagram', label: 'Instagram Feed', icon: Instagram },
  { href: '/admin/size-guides', label: 'Size Guides', icon: Ruler },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'bg-[#013220] text-white transition-all duration-300 flex flex-col',
          isSidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className={cn(
            'block transition-all',
            !isSidebarOpen && 'flex justify-center'
          )}>
            <Image
              src="/logo.svg"
              alt="BJÖRK & CO."
              width={isSidebarOpen ? 160 : 40}
              height={isSidebarOpen ? 32 : 32}
              className={cn(
                'transition-all',
                !isSidebarOpen && 'w-10'
              )}
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-6 py-3 text-[14px] transition-colors hover:bg-white/10',
                  !isSidebarOpen && 'justify-center px-4'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 text-[14px] text-white/80 hover:text-white transition-colors w-full',
              !isSidebarOpen && 'justify-center'
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle Sidebar */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-4 border-t border-white/10 text-white/60 hover:text-white transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[24px] text-black">Admin Dashboard</h2>
            <div className="text-[14px] text-gray-500">
              Welcome, Admin
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
