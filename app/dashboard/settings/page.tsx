"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { UserManagement } from '../components/UserManagement';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const availablePermissions = [
  { id: 'create_invoice', label: 'Create Invoice' },
  { id: 'view_clients', label: 'View Clients' },
  { id: 'edit_settings', label: 'Edit Settings' },
  { id: 'manage_users', label: 'Manage Users' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'user' | 'company' | 'security' | 'roles' | 'users'>('user');
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
  const [roles, setRoles] = useState<Role[]>([
    { id: 'admin', name: 'Admin', permissions: ['create_invoice', 'view_clients', 'edit_settings', 'manage_users'] },
    { id: 'team', name: 'Team', permissions: ['create_invoice', 'view_clients'] },
    { id: 'customer', name: 'Customer', permissions: ['view_clients'] },
  ]);
  const [newRole, setNewRole] = useState<Omit<Role, 'id'>>({ name: '', permissions: [] });
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

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

  const handleAddRole = () => {
    const roleId = newRole.name.toLowerCase().replace(/\s+/g, '_');
    setRoles([...roles, { ...newRole, id: roleId }]);
    setNewRole({ name: '', permissions: [] });
    setIsAddRoleOpen(false);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setNewRole({ name: role.name, permissions: role.permissions });
    setIsAddRoleOpen(true);
  };

  const handleUpdateRole = () => {
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...editingRole, ...newRole } : r));
      setEditingRole(null);
      setNewRole({ name: '', permissions: [] });
      setIsAddRoleOpen(false);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
      
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
                  Paramètres Utilisateur
                </Button>
                <Button
                  variant={activeTab === 'company' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('company')}
                >
                  Paramètres Entreprise
                </Button>
                <Button
                  variant={activeTab === 'security' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('security')}
                >
                  Sécurité
                </Button>
                <Button
                  variant={activeTab === 'roles' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('roles')}
                >
                  Rôles & Permissions
                </Button>
                <Button
                  variant={activeTab === 'users' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('users')}
                >
                  Gestion des Utilisateurs
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
                <CardTitle>Paramètres Utilisateur</CardTitle>
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
                <CardTitle>Paramètres Entreprise</CardTitle>
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
                <CardTitle>Sécurité</CardTitle>
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
                <CardTitle>Rôles & Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
                    <DialogTrigger asChild>
                      <Button>Ajouter un Rôle</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingRole ? 'Modifier le Rôle' : 'Ajouter un Nouveau Rôle'}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="roleName" className="text-right">Nom du Rôle</Label>
                          <Input
                            id="roleName"
                            value={newRole.name}
                            onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label className="text-right">Permissions</Label>
                          <div className="col-span-3 space-y-2">
                            {availablePermissions.map((permission) => (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`role-${permission.id}`}
                                  checked={newRole.permissions.includes(permission.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setNewRole({...newRole, permissions: [...newRole.permissions, permission.id]});
                                    } else {
                                      setNewRole({...newRole, permissions: newRole.permissions.filter(p => p !== permission.id)});
                                    }
                                  }}
                                />
                                <label htmlFor={`role-${permission.id}`}>{permission.label}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button onClick={editingRole ? handleUpdateRole : handleAddRole}>
                        {editingRole ? 'Mettre à jour' : 'Ajouter'}
                      </Button>
                    </DialogContent>
                  </Dialog>

                  <div className="space-y-4">
                    {roles.map((role) => (
                      <Card key={role.id}>
                        <CardHeader>
                          <CardTitle>{role.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p>Permissions:</p>
                            <ul className="list-disc list-inside">
                              {role.permissions.map((permissionId) => (
                                <li key={permissionId}>
                                  {availablePermissions.find(p => p.id === permissionId)?.label}
                                </li>
                              ))}
                            </ul>
                            <div className="space-x-2">
                              <Button variant="outline" onClick={() => handleEditRole(role)}>Modifier</Button>
                              <Button variant="destructive" onClick={() => handleDeleteRole(role.id)}>Supprimer</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'users' && (
            <UserManagement />
          )}
        </div>
      </div>
    </div>
  );
}
