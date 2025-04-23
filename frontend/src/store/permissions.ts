import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUserPermissions } from '@/lib/api/auth';

// Define the store state type
interface PermissionsState {
  permissions: string[];
  isLoading: boolean;
  error: string | null;
  fetchPermissions: () => Promise<string[]>;
  clearPermissions: () => void;
}

// Create the store with persistence
export const usePermissionsStore = create<PermissionsState>()(
  persist(
    (set) => ({
      permissions: [],
      isLoading: false,
      error: null,
      
      fetchPermissions: async () => {
        try {
          set({ isLoading: true, error: null });
          const permissions = await getUserPermissions();
          set({ permissions, isLoading: false });
          return permissions;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch permissions', 
            isLoading: false 
          });
          return [];
        }
      },
      
      clearPermissions: () => {
        set({ permissions: [], error: null });
      },
    }),
    {
      name: 'user-permissions', // unique name for localStorage
      partialize: (state) => ({ permissions: state.permissions }), // only persist permissions
    }
  )
); 