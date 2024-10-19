"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { toast } from '@/hooks/use-toast';
import localforage from 'localforage';

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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UserManagementSection = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', role: 'user' });
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    // Charger les utilisateurs depuis localforage au chargement du composant
    const loadUsers = async () => {
      const savedUsers = await localforage.getItem<User[]>('users');
      if (savedUsers) {
        setUsers(savedUsers);
      }
    };
    loadUsers();
  }, []);

  const handleAddUser = async () => {
    const newUserWithId = { ...newUser, id: Date.now().toString() };
    const updatedUsers = [...users, newUserWithId];
    setUsers(updatedUsers);
    await saveUsers(updatedUsers);
    setNewUser({ name: '', email: '', role: 'user' });
    setIsAddUserOpen(false);
    toast({
      title: "Utilisateur ajouté",
      description: "Le nouvel utilisateur a été ajouté avec succès.",
    });
  };

  const handleEditUser = async (user: User) => {
    setEditingUser(user);
    setNewUser({ name: user.name, email: user.email, role: user.role });
    setIsAddUserOpen(true);
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      const updatedUsers = users.map(u => u.id === editingUser.id ? { ...editingUser, ...newUser } : u);
      setUsers(updatedUsers);
      await saveUsers(updatedUsers);
      setEditingUser(null);
      setNewUser({ name: '', email: '', role: 'user' });
      setIsAddUserOpen(false);
      toast({
        title: "Utilisateur mis à jour",
        description: "Les informations de l'utilisateur ont été mises à jour avec succès.",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    await saveUsers(updatedUsers);
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès.",
    });
  };

  const saveUsers = async (usersToSave: User[]) => {
    try {
      await localforage.setItem('users', usersToSave);
      toast({
        title: "Utilisateurs sauvegardés",
        description: "La liste des utilisateurs a été mise à jour avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des utilisateurs.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setIsAddUserOpen(true)}>Ajouter un Utilisateur</Button>
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant="outline" onClick={() => handleEditUser(user)}>Modifier</Button>
                  <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Modifier l\'Utilisateur' : 'Ajouter un Nouvel Utilisateur'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nom</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Rôle</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">Utilisateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={editingUser ? handleUpdateUser : handleAddUser}>
                {editingUser ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

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

  useEffect(() => {
    const loadSettings = async () => {
      const savedUserSettings = await localforage.getItem<UserSettings>('userSettings');
      if (savedUserSettings) setUserSettings(savedUserSettings);

      const savedCompanySettings = await localforage.getItem<CompanySettings>('companySettings');
      if (savedCompanySettings) setCompanySettings(savedCompanySettings);

      const savedRoles = await localforage.getItem<Role[]>('roles');
      if (savedRoles) setRoles(savedRoles);

      // Chargez les utilisateurs dans le composant UserManagementSection
    };

    loadSettings();
  }, []);

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

  const handleSaveUserSettings = async () => {
    await localforage.setItem('userSettings', userSettings);
    toast({
      title: "Paramètres utilisateur sauvegardés",
      description: "Vos paramètres ont été mis à jour avec succès.",
    });
  };

  const handleSaveCompanySettings = async () => {
    await localforage.setItem('companySettings', companySettings);
    toast({
      title: "Paramètres entreprise sauvegardés",
      description: "Les paramètres de l'entreprise ont été mis à jour avec succès.",
    });
  };

  const handleSaveRoles = async () => {
    await localforage.setItem('roles', roles);
    toast({
      title: "Rôles et permissions sauvegardés",
      description: "Les rôles et permissions ont été mis à jour avec succès.",
    });
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    // Ici, vous devriez implémenter la logique de changement de mot de passe
    // Pour cet exemple, nous allons simplement simuler une sauvegarde
    await localforage.setItem('passwordChanged', new Date().toISOString());
    toast({
      title: "Mot de passe changé",
      description: "Votre mot de passe a été mis à jour avec succès.",
    });
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
                  <Button onClick={handleSaveUserSettings}>Sauvegarder les paramètres utilisateur</Button>
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
                  <Button onClick={handleSaveCompanySettings}>Sauvegarder les paramètres entreprise</Button>
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
                  <Button onClick={() => handleChangePassword('currentPassword', 'newPassword')}>Changer le mot de passe</Button>
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
                <Button onClick={handleSaveRoles}>Sauvegarder les rôles et permissions</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'users' && (
            <UserManagementSection />
          )}
        </div>
      </div>
    </div>
  );
}
