'use client';

import { Menu, Plus, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVSUALStore } from '@/lib/store';

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const VIEW_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  pipeline: 'Pipeline',
  leads: 'Leads',
  tasks: 'Tasks',
  automation: 'Automation',
  alerts: 'Alerts',
};

export function Header() {
  const { currentView, setSidebarOpen, setNewLeadDialogOpen, currentUser } = useVSUALStore();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-card/80 backdrop-blur-sm px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1">
        <h2 className="text-lg font-semibold">{VIEW_TITLES[currentView]}</h2>
        <p className="text-xs text-muted-foreground hidden sm:block">
          {capitalize(currentUser)}&apos;s workspace
        </p>
      </div>

      <Button
        onClick={() => setNewLeadDialogOpen(true)}
        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add Lead</span>
      </Button>

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 min-w-[18px] justify-center rounded-full px-1 text-[10px]"
        >
          3
        </Badge>
      </Button>
    </header>
  );
}
