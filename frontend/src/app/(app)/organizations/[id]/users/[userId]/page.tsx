'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useUpdateUser, useDeleteUser, useResendInvitation } from '@/hooks/api/use-users';
import { User, UpdateUserData } from '@/types/user';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfileForm } from '@/components/users/user-profile-form';
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Clock, 
  Shield, 
  Building, 
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useIsAdmin } from '@/lib/permission';

export default function OrganizationUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;
  const userId = params.userId as string;
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data, isLoading } = useUser(userId, organizationId);
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: resendInvite, isPending: isResending } = useResendInvitation();
  const isAdmin = useIsAdmin();
  
  const user = data?.data?.user;
  
  const handleBack = () => {
    router.push(`/organizations/${organizationId}/users`);
  };
  
  const handleEdit = () => {
    setIsEditMode(true);
  };
  
  const handleSave = (formData: any) => {
    updateUser(
      { id: userId, data: { ...formData, organizationId: organizationId } },
      {
        onSuccess: () => {
          toast.success('User updated successfully');
          setIsEditMode(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update user');
        },
      }
    );
  };
  
  const handleCancel = () => {
    setIsEditMode(false);
  };
  
  const handleDelete = () => {
    deleteUser(userId, {
      onSuccess: () => {
        toast.success('User deleted successfully');
        router.push(`/organizations/${organizationId}/users`);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete user');
      },
    });
  };
  
  const handleResendInvite = () => {
    resendInvite(userId, {
      onSuccess: () => {
        toast.success('Invitation resent successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to resend invitation');
      },
    });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
        <div className="h-32 w-full animate-pulse bg-gray-200 rounded-lg"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>User Not Found</CardTitle>
            <CardDescription>The user you are looking for does not exist or you do not have permission to view it.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleBack}>Return to User List</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const isPending = user.status === 'pending';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatarUrl} alt={user.name || user.email} />
                  <AvatarFallback className="text-lg">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name || 'Unnamed User'}</CardTitle>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-1" />
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {isPending && (
                  <Button 
                    variant="outline" 
                    onClick={handleResendInvite}
                    disabled={isResending}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {isResending ? 'Resending...' : 'Resend Invite'}
                  </Button>
                )}
                {isAdmin && (
                  <Button 
                    onClick={handleEdit} 
                    disabled={isEditMode}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {isEditMode ? (
                <UserProfileForm 
                  user={user} 
                  onSave={handleSave} 
                  onCancel={handleCancel}
                  isPending={isUpdating}
                  organizationId={organizationId}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                        <p className="flex items-center mt-1">
                          <Shield className="h-4 w-4 mr-2" />
                          <Badge variant="outline">{user.roleDisplayName}</Badge>
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                        <p className="flex items-center mt-1">
                          <div className={`h-2 w-2 rounded-full mr-2 ${
                            user.status === 'active' ? 'bg-green-500' : 
                            user.status === 'inactive' ? 'bg-gray-500' : 
                            'bg-yellow-500'
                          }`} />
                          {user.status === 'active' ? 'Active' : 
                           user.status === 'inactive' ? 'Inactive' : 
                           'Pending Activation'}
                        </p>
                      </div>
                      
                      {user.organizationName && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Organization</h3>
                          <p className="flex items-center mt-1">
                            <Building className="h-4 w-4 mr-2" />
                            {user.organizationName}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Joined</h3>
                        <p className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(user.createdAt), 'PPP')}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Last Login</h3>
                        <p className="flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-2" />
                          {user.lastLoginAt 
                            ? format(new Date(user.lastLoginAt), 'PPP') 
                            : 'Never logged in'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {isPending && (
                    <div className="flex items-center p-4 border rounded-lg bg-yellow-50 text-yellow-800">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <div>
                        <h4 className="font-semibold">Pending Activation</h4>
                        <p className="text-sm">
                          This user has been invited but has not yet activated their account.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            
            {!isEditMode && (
              <CardFooter className="border-t pt-6">
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete User
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>View user activity and login history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Activity history will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will deactivate the user account. The user will no longer be able to access the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 