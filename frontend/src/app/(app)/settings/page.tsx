'use client'

import React from 'react'
import { useUserSettings, useUpdateUserSettings } from '@/hooks/useSettings'
import { useAuthState } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { formatDate } from '@/lib/utils'

export default function SettingsPage() {
  const { data: settings, isLoading } = useUserSettings()
  const { user } = useAuthState()
  const updateSettings = useUpdateUserSettings()

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  const handleThemeChange = (value: string) => {
    updateSettings.mutate(
      { theme: value as 'light' | 'dark' | 'system' },
      {
        onSuccess: () => {
          toast({
            title: 'Settings updated',
            description: 'Your theme preference has been saved.',
          })
        },
      }
    )
  }

  const handleNotificationToggle = (type: 'email' | 'push' | 'inApp', checked: boolean) => {
    updateSettings.mutate(
      {
        notifications: {
          ...settings?.notifications,
          [type]: checked,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: 'Settings updated',
            description: 'Your notification preferences have been saved.',
          })
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>Customize your application experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme Mode</Label>
                <Select
                  value={settings?.theme || 'system'}
                  onValueChange={handleThemeChange}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue={settings?.preferences?.language || 'en'}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>View and update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Email</Label>
                  <div className="mt-1 font-medium">{user?.email}</div>
                </div>
                <div>
                  <Label>Name</Label>
                  <div className="mt-1 font-medium">{user?.name || 'Not set'}</div>
                </div>
                <div>
                  <Label>Role</Label>
                  <div className="mt-1 font-medium">{user?.role}</div>
                </div>
                <div>
                  <Label>Organization</Label>
                  <div className="mt-1 font-medium">
                    {user?.organizationId ? 'Joined' : 'Not assigned'}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch 
                    checked={settings?.notifications?.email || false}
                    onCheckedChange={(checked: boolean) => handleNotificationToggle('email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your device
                    </p>
                  </div>
                  <Switch 
                    checked={settings?.notifications?.push || false}
                    onCheckedChange={(checked: boolean) => handleNotificationToggle('push', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block">In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show notifications in the application
                    </p>
                  </div>
                  <Switch 
                    checked={settings?.notifications?.inApp || false}
                    onCheckedChange={(checked: boolean) => handleNotificationToggle('inApp', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 