'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { ThemeType } from '@/hooks/api/use-preferences';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Building2, UserCheck } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Default values for preferences
const DEFAULT_PREFERENCES = {
  theme: 'system',
  language: 'en',
  emailNotifications: true,
  pushNotifications: true,
  timezone: 'Asia/Kolkata',
  dateFormat: 'YYYY-MM-DD'
};

// Common date formats
const DATE_FORMATS = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2023-04-15)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (04/15/2023)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (15/04/2023)' },
  { value: 'DD-MMM-YYYY', label: 'DD-MMM-YYYY (15-Apr-2023)' },
  { value: 'MMMM D, YYYY', label: 'MMMM D, YYYY (April 15, 2023)' },
];

// Available timezone options (just Indian Standard Time for now)
const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'Indian Standard Time (IST)' },
];

interface ProfileFormProps {
  user: User;
  onSave: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function ProfileForm({ user, onSave, onCancel, isPending }: ProfileFormProps) {
  // Create state for each form field
  const [name, setName] = useState(user.name || '');
  const [theme, setTheme] = useState<ThemeType>(
    (user.preferences?.theme as ThemeType) || DEFAULT_PREFERENCES.theme as ThemeType
  );
  const [language, setLanguage] = useState(user.preferences?.language || DEFAULT_PREFERENCES.language);
  const [emailNotifications, setEmailNotifications] = useState(
    user.preferences?.emailNotifications ?? DEFAULT_PREFERENCES.emailNotifications
  );
  const [pushNotifications, setPushNotifications] = useState(
    user.preferences?.pushNotifications ?? DEFAULT_PREFERENCES.pushNotifications
  );
  const [timezone, setTimezone] = useState(user.preferences?.timezone || DEFAULT_PREFERENCES.timezone);
  const [dateFormat, setDateFormat] = useState(user.preferences?.dateFormat || DEFAULT_PREFERENCES.dateFormat);
  
  // Initialize state with user data when it changes
  useEffect(() => {
    setName(user.name || '');
    setTheme(user.preferences?.theme as ThemeType || DEFAULT_PREFERENCES.theme as ThemeType);
    setLanguage(user.preferences?.language || DEFAULT_PREFERENCES.language);
    setEmailNotifications(user.preferences?.emailNotifications ?? DEFAULT_PREFERENCES.emailNotifications);
    setPushNotifications(user.preferences?.pushNotifications ?? DEFAULT_PREFERENCES.pushNotifications);
    setTimezone(user.preferences?.timezone || DEFAULT_PREFERENCES.timezone);
    setDateFormat(user.preferences?.dateFormat || DEFAULT_PREFERENCES.dateFormat);
  }, [user]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Structure data for API call
    const formData = {
      name,
      email: user.email, // Not editable but included for API
      preferences: {
        theme,
        language,
        emailNotifications,
        pushNotifications,
        timezone,
        dateFormat,
      }
    };
    
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input 
            id="name"
            placeholder="John Doe" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input 
            id="email"
            disabled={true} 
            placeholder="john@example.com" 
            value={user.email}
          />
        </div>
        
        {/* Organization - Non-editable */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Organization</label>
          <div className="flex items-center h-10 px-3 rounded-md border border-input bg-background/50">
            <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{user.organizationName || 'Not assigned'}</span>
          </div>
        </div>
        
        {/* Status - Non-editable */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <div className="flex items-center h-10 px-3 rounded-md border border-input bg-background/50">
            <UserCheck className="mr-2 h-4 w-4 text-muted-foreground" />
            <Badge variant={user.status === 'active' ? 'default' : user.status === 'pending' ? 'outline' : 'destructive'}>
              {user.status || 'Unknown'}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Preferences</h3>
        
        <div className="space-y-2">
          <label htmlFor="theme" className="text-sm font-medium">Theme</label>
          <Select 
            value={theme} 
            onValueChange={(value: ThemeType) => setTheme(value)}
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
          <label htmlFor="language" className="text-sm font-medium">Language</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <Checkbox
            id="emailNotifications"
            checked={emailNotifications}
            onCheckedChange={(checked) => setEmailNotifications(checked as boolean)}
          />
          <div className="space-y-1 leading-none">
            <label
              htmlFor="emailNotifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email Notifications
            </label>
            <p className="text-sm text-muted-foreground">
              Receive email notifications about updates and activities.
            </p>
          </div>
        </div>
        
        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <Checkbox
            id="pushNotifications"
            checked={pushNotifications}
            onCheckedChange={(checked) => setPushNotifications(checked as boolean)}
          />
          <div className="space-y-1 leading-none">
            <label
              htmlFor="pushNotifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Push Notifications
            </label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications on your device.
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="timezone" className="text-sm font-medium">Timezone</label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="dateFormat" className="text-sm font-medium">Date Format</label>
          <Select value={dateFormat} onValueChange={setDateFormat}>
            <SelectTrigger id="dateFormat">
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              {DATE_FORMATS.map(format => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
} 