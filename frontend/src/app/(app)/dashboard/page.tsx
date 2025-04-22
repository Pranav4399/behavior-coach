import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">View your analytics data here</p>
            <div className="mt-4 h-40 w-full rounded-md bg-muted flex items-center justify-center">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your recent activity will be shown here</p>
            <ul className="mt-4 space-y-2">
              <li className="rounded-md bg-muted p-2">Activity item 1</li>
              <li className="rounded-md bg-muted p-2">Activity item 2</li>
              <li className="rounded-md bg-muted p-2">Activity item 3</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full">Create New Organization</Button>
              <Button className="w-full" variant="outline">Invite Users</Button>
              <Button className="w-full" variant="secondary">View Reports</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 