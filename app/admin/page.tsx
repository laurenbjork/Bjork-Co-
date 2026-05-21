import Link from 'next/link';
import { 
  Package, 
  FolderOpen, 
  ShoppingBag,
  FileText,
  MessageSquare,
  TrendingUp,
  Users
} from 'lucide-react';

const stats = [
  { label: 'Total Products', value: '5', icon: Package, href: '/admin/products' },
  { label: 'Collections', value: '4', icon: FolderOpen, href: '/admin/collections' },
  { label: 'Categories', value: '7', icon: ShoppingBag, href: '/admin/categories' },
  { label: 'Blog Posts', value: '2', icon: FileText, href: '/admin/blog' },
];

const quickActions = [
  { label: 'Add New Product', href: '/admin/products/new', description: 'Create a new product listing' },
  { label: 'Write Blog Post', href: '/admin/blog/new', description: 'Publish a new blog article' },
  { label: 'View Inquiries', href: '/admin/inquiries', description: 'Check customer form submissions' },
  { label: 'Site Settings', href: '/admin/settings', description: 'Update site configuration' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white border border-gray-200 p-6">
        <h1 className="font-serif text-[28px] text-black mb-2">
          Welcome to the Admin Dashboard
        </h1>
        <p className="text-gray-600 text-[15px]">
          Manage your products, collections, blog posts, and site settings from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white border border-gray-200 p-6 hover:border-[#013220] transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-[#013220]" />
                <span className="text-[32px] font-serif text-black group-hover:text-[#013220] transition-colors">
                  {stat.value}
                </span>
              </div>
              <p className="text-[14px] text-gray-600">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="font-serif text-[20px] text-black mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-start gap-4 p-4 border border-gray-200 hover:border-[#013220] transition-colors"
            >
              <div className="w-10 h-10 bg-[#013220]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-[#013220]" />
              </div>
              <div>
                <h3 className="font-medium text-[16px] text-black mb-1">
                  {action.label}
                </h3>
                <p className="text-[14px] text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity / Placeholder */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="font-serif text-[20px] text-black mb-6">Recent Activity</h2>
        <p className="text-gray-500 text-[14px]">
          Activity tracking coming soon. You'll see recent product updates, form submissions, and blog posts here.
        </p>
      </div>
    </div>
  );
}
