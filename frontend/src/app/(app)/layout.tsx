'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import AppLayout from '@/components/layouts/AppLayout';

export default function AppPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
} 