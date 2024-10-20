"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <nav className="space-y-2">
          <Button
            variant={activeTab === 'list' ? 'default' : 'ghost'}
            className="w-full justify-start text-base"
            onClick={() => onTabChange('list')}
          >
            Liste des Clients
          </Button>
          <Button
            variant={activeTab === 'add' ? 'default' : 'ghost'}
            className="w-full justify-start text-base"
            onClick={() => onTabChange('add')}
          >
            Ajouter un Client
          </Button>
          <Button
            variant={activeTab === 'stats' ? 'default' : 'ghost'}
            className="w-full justify-start text-base"
            onClick={() => onTabChange('stats')}
          >
            Statistiques
          </Button>
        </nav>
      </CardContent>
    </Card>
  );
};
