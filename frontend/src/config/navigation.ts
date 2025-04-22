import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  BarChart, 
  Settings
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
}

export const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, requiresAuth: true },
  { name: 'Organizations', href: '/organizations', icon: Building2, requiresAuth: true },
  { name: 'Subscription', href: '/subscription', icon: CreditCard, requiresAuth: true },
  { name: 'Analytics', href: '/analytics', icon: BarChart, requiresAuth: true },
  { name: 'Settings', href: '/settings', icon: Settings, requiresAuth: true },
]; 