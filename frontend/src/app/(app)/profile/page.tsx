'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser, useUpdateUser } from '@/hooks/api/use-users';
import { 
  useUpdateUserPreferences,
  ThemeType,
  UpdateUserPreferencesData
} from '@/hooks/api/use-preferences';
import { UpdateUserData } from '@/types/user';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ProfileForm } from '@/components/profile/profile-form';
import { toast } from 'sonner';
import { User, Mail, Calendar, Building2, Palette, Globe } from 'lucide-react';
import { format } from 'date-fns';

// Helper to format preference values for display
const formatLanguage = (code: string) => {
  const languages: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German'
  };
  return languages[code] || code;
};

const formatTheme = (theme: string) => {
  const themes: Record<string, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'System (follows device)'
  };
  return themes[theme] || theme;
};

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { data: userData, isLoading } = useUser(authUser?.id || '', authUser?.organizationId);
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { mutate: updatePreferences, isPending: isUpdatingPreferences } = useUpdateUserPreferences();
  
  const user = userData?.data?.user;
  const isUpdating = isUpdatingUser || isUpdatingPreferences;
  
  // Get initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '';
  
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-primary">Loading profile...</div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleSave = (formData: {
    name?: string;
    email: string;
    preferences?: {
      theme: string;
      language: string;
      emailNotifications: boolean;
      pushNotifications: boolean;
      timezone?: string;
      dateFormat?: string;
    }
  }) => {
    // Update user profile data (only name for now)
    const updateData: UpdateUserData = {
      ...formData,
      organizationId: authUser?.organizationId
    };

    // First update the user profile
    updateUser(
      { 
        id: user.id, 
        data: updateData
      },
      {
        onSuccess: () => {
          // Then update preferences if they exist
          if (formData.preferences) {
            const preferencesData: UpdateUserPreferencesData = {
              theme: formData.preferences.theme as ThemeType,
              language: formData.preferences.language,
              emailNotifications: formData.preferences.emailNotifications,
              pushNotifications: formData.preferences.pushNotifications,
              timezone: formData.preferences.timezone || 'UTC',
              dateFormat: formData.preferences.dateFormat || 'YYYY-MM-DD'
            };
            
            updatePreferences(
              {
                userId: user.id,
                data: preferencesData
              },
              {
                onSuccess: () => {
                  toast.success('Profile and preferences updated successfully');
                  setIsEditMode(false);
                },
                onError: (error) => {
                  toast.error('Failed to update preferences');
                  console.error('Preferences update error:', error);
                }
              }
            );
          } else {
            toast.success('Profile updated successfully');
            setIsEditMode(false);
          }
        },
        onError: (error) => {
          toast.error('Failed to update profile');
          console.error('Update error:', error);
        }
      }
    );
  };

  return (
    <div className="container max-w-4xl mx-auto pb-10">
      <h1 className="mb-6 text-3xl font-bold">Your Profile</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
            <CardDescription>
              View and manage your account information
            </CardDescription>
          </div>
          
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isEditMode ? (
            <ProfileForm 
              user={user} 
              onSave={handleSave} 
              onCancel={handleCancel}
              isPending={isUpdating}
            />
          ) : (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <User className="mr-2 h-4 w-4" />
                      <span>Name</span>
                    </div>
                    <p className="font-medium">{user.name || 'Not set'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Email</span>
                    </div>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <Building2 className="mr-2 h-4 w-4" />
                      <span>Organization</span>
                    </div>
                    <p className="font-medium">{user.organizationName || 'Not assigned'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Member Since</span>
                    </div>
                    <p className="font-medium">
                      {format(new Date(user.createdAt), 'PPP')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Preferences</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Palette className="mr-2 h-4 w-4" />
                        <span>Theme</span>
                      </div>
                      <p className="font-medium">
                        {formatTheme(user.preferences?.theme || 'system')}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Globe className="mr-2 h-4 w-4" />
                        <span>Language</span>
                      </div>
                      <p className="font-medium">
                        {formatLanguage(user.preferences?.language || 'en')}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <span>Email Notifications</span>
                      </div>
                      <p className="font-medium">
                        {user.preferences?.emailNotifications ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <span>Push Notifications</span>
                      </div>
                      <p className="font-medium">
                        {user.preferences?.pushNotifications ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    
                    {user.preferences?.timezone && (
                      <div className="space-y-2">
                        <div className="flex items-center text-muted-foreground">
                          <span>Timezone</span>
                        </div>
                        <p className="font-medium">{user.preferences.timezone}</p>
                      </div>
                    )}
                    
                    {user.preferences?.dateFormat && (
                      <div className="space-y-2">
                        <div className="flex items-center text-muted-foreground">
                          <span>Date Format</span>
                        </div>
                        <p className="font-medium">{user.preferences.dateFormat}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button onClick={handleEdit}>Edit Profile</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 