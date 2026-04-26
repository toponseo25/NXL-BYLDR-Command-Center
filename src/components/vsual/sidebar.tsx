'use client';

import {
  LayoutDashboard,
  GitBranch,
  Users,
  CheckSquare,
  Zap,
  Bell,
  ChevronLeft,
  Moon,
  Sun,
  Monitor,
  LogOut,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useVSUALStore } from '@/lib/store';
import type { ViewType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS: { key: ViewType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'pipeline', label: 'Pipeline', icon: GitBranch },
  { key: 'leads', label: 'Leads', icon: Users },
  { key: 'tasks', label: 'Tasks', icon: CheckSquare },
  { key: 'automation', label: 'Automation', icon: Zap },
  { key: 'alerts', label: 'Alerts', icon: Bell },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              if (theme === 'dark') setTheme('light');
              else if (theme === 'light') setTheme('system');
              else setTheme('dark');
            }}
          >
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Theme: {theme}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function Sidebar() {
  const { currentView, setCurrentView, currentUser, setCurrentUser, sidebarOpen, setSidebarOpen } = useVSUALStore();

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: sidebarOpen ? 0 : 0 }}
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-border bg-card transition-transform duration-300 lg:relative lg:translate-x-0',
        !sidebarOpen && '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <img src="/vsual-logo.png" alt="VSUAL" className="h-8 w-8 rounded-lg" />
        <div>
          <h1 className="text-lg font-bold tracking-tight">VSUAL OS</h1>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Business OS</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.key;
          return (
            <TooltipProvider key={item.key} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3 px-3 font-medium transition-all',
                      isActive && 'bg-accent text-accent-foreground shadow-sm'
                    )}
                    onClick={() => {
                      setCurrentView(item.key);
                      setSidebarOpen(false);
                    }}
                  >
                    <item.icon className={cn('h-4 w-4', isActive && 'text-primary')} />
                    {item.label}
                    {item.key === 'alerts' && (
                      <Badge variant="destructive" className="ml-auto h-5 min-w-[20px] justify-center rounded-full px-1.5 text-[10px]">
                        3
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="lg:hidden">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>

      <Separator />

      {/* User Switcher */}
      <div className="p-3">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Team</p>
        <div className="space-y-1">
          {(['Sal', 'Geo'] as const).map((user) => (
            <Button
              key={user}
              variant={currentUser === user ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 px-3"
              onClick={() => setCurrentUser(user)}
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className={cn(
                  'text-xs font-bold text-white',
                  user === 'Sal' ? 'bg-emerald-600' : 'bg-amber-600'
                )}>
                  {user}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{user}</span>
              {currentUser === user && (
                <div className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <div className="px-3 pb-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive"
          onClick={() => window.location.reload()}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border">
        <span className="text-xs text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
    </motion.aside>
  );
}

export function MobileSidebarOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
    </AnimatePresence>
  );
}
