/**
 * AdminLayout — shell for all /admin/* pages except /admin/login.
 * Wraps children in RequireAuth, renders sidebar nav + content area.
 */
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Trophy,
  FileText,
  Heart,
  Handshake,
  MessageSquare,
  HelpCircle,
  Phone,
  BarChart2,
  Image,
  Layers,
  Settings,
  Star,
  LogOut,
} from 'lucide-react';
import { RequireAuth } from './RequireAuth';
import { supabase } from '../../lib/supabase';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/team', label: 'Team', icon: Users },
  { to: '/admin/awards', label: 'Awards', icon: Trophy },
  { to: '/admin/reports', label: 'Annual Reports', icon: FileText },
  { to: '/admin/volunteer-roles', label: 'Volunteer Roles', icon: Heart },
  { to: '/admin/partners', label: 'Partners', icon: Handshake },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/admin/contact-info', label: 'Contact Info', icon: Phone },
  { to: '/admin/stats', label: 'Stats', icon: BarChart2 },
  { to: '/admin/hero', label: 'Homepage Hero', icon: Image },
  { to: '/admin/programs', label: 'Programs', icon: Layers },
  { to: '/admin/honours', label: 'Honours', icon: Star },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  return (
    <RequireAuth>
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-gray-900 text-gray-100 flex flex-col">
          <div className="px-6 py-5 border-b border-gray-700">
            <span className="font-bold text-lg tracking-wide text-white">VIVA Admin</span>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="px-3 pb-5 border-t border-gray-700 pt-4">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </RequireAuth>
  );
}
