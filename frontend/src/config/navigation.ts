import { 
  LayoutDashboard, 
  Building2, 
  Settings,
  Users
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

export const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, requiresAuth: true },
  { name: 'Organizations', href: '/organizations', icon: Building2, requiresAuth: true },
  { name: 'Workers', href: '/workers', icon: Users, requiresAuth: true },
  { name: 'Settings', href: '/settings', icon: Settings, requiresAuth: true, requiresAdmin: true },
]; 