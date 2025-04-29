import { 
  LayoutDashboard, 
  Building2, 
  Settings,
  Users,
  Layers,
  Puzzle
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  hidePlatformAdmin?: boolean;
}

export const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, requiresAuth: true },
  { name: 'Organizations', href: '/organizations', icon: Building2, requiresAuth: true },
  { name: 'Workers', href: '/workers', icon: Users, requiresAuth: true, hidePlatformAdmin: true },
  { name: 'Segments', href: '/segments', icon: Layers, requiresAuth: true, hidePlatformAdmin: true },
  { name: 'Rule Builder Demo', href: '/rule-builder-demo', icon: Puzzle, requiresAuth: true },
  { name: 'Settings', href: '/settings', icon: Settings, requiresAuth: true, requiresAdmin: true },
]; 