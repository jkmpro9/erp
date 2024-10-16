"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface UserSettings {
  username: string;
  email: string;
  notifications: boolean;
  darkMode: boolean;
  role: 'admin' | 'team' | 'customer';
  permissions: string[];
}

interface CompanySettings {
  companyName: string;
  address: string;
  taxId: string;
}

const availablePermissions = [
  { id: 'create_invoice', label: 'Create Invoice' },
  { id: 'view_clients', label: 'View Clients' },
  { id: 'edit_settings', label: 'Edit Settings' },
  { id: 'manage_users', label: 'Manage Users' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'user' | 'company' | 'security' | 'roles'>('user');
  const [userSettings, setUserSettings] = useState<UserSettings>({
    username: 'johndoe',
    email: 'john@example.com',
    notifications: true,
    darkMode: false,
    role: 'team',
    permissions: ['create_invoice', 'view_clients'],
  });
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: 'Acme Inc.',
    address: '123 Business St, City, Country',
    taxId: 'TAX123456',
  });

  const handleUserSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCompanySettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanySettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: 'admin' | 'team' | 'customer') => {
    setUserSettings(prev => ({ ...prev, role }));
  };

  const handlePermissionChange = (permissionId: string) => {
    setUserSettings(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      <div className="flex">
        {/* Left sidebar */}
        <div className="w-64 pr-4">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <Button
                  variant={activeTab === 'user' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('user')}
                >
                  User Settings
                </Button>
                <Button
                  variant={activeTab === 'company' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('company')}
                >
                  Company Settings
                </Button>
                <Button
                  variant={activeTab === 'security' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('security')}
                >
                  Security
                </Button>
                <Button
                  variant={activeTab === 'roles' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('roles')}
                >
                  Roles & Permissions
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          {activeTab === 'user' && (
            <Card>
              <CardHeader>
                <CardTitle>User Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={userSettings.username}
                      onChange={handleUserSettingChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userSettings.email}
                      onChange={handleUserSettingChange}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="notifications"
                      name="notifications"
                      checked={userSettings.notifications}
                      onCheckedChange={(checked) => setUserSettings(prev => ({ ...prev, notifications: checked }))}
                    />
                    <Label htmlFor="notifications">Enable Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="darkMode"
                      name="darkMode"
                      checked={userSettings.darkMode}
                      onCheckedChange={(checked) => setUserSettings(prev => ({ ...prev, darkMode: checked }))}
                    />
                    <Label htmlFor="darkMode">Dark Mode</Label>
                  </div>
                  <Button onClick={() => console.log("Save User Settings", userSettings)}>Save User Settings</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'company' && (
            <Card>
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={companySettings.companyName}
                      onChange={handleCompanySettingChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={companySettings.address}
                      onChange={handleCompanySettingChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input
                      id="taxId"
                      name="taxId"
                      value={companySettings.taxId}
                      onChange={handleCompanySettingChange}
                    />
                  </div>
                  <Button onClick={() => console.log("Save Company Settings", companySettings)}>Save Company Settings</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button onClick={() => console.log("Change Password")}>Change Password</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'roles' && (
            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="role">User Role</Label>
                    <Select onValueChange={handleRoleChange} value={userSettings.role}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="team">Team</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Permissions</Label>
                    <div className="space-y-2">
                      {availablePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={userSettings.permissions.includes(permission.id)}
                            onCheckedChange={() => handlePermissionChange(permission.id)}
                          />
                          <label
                            htmlFor={permission.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => console.log("Save Roles & Permissions", userSettings)}>Save Roles & Permissions</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
