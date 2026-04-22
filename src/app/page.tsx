'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar, MobileSidebarOverlay } from '@/components/vsual/sidebar';
import { Header } from '@/components/vsual/header';
import { DashboardView } from '@/components/vsual/dashboard-view';
import { PipelineView } from '@/components/vsual/pipeline-view';
import { LeadsView } from '@/components/vsual/leads-view';
import { TasksView } from '@/components/vsual/tasks-view';
import { AutomationView } from '@/components/vsual/automation-view';
import { AlertsView } from '@/components/vsual/alerts-view';
import { NewLeadDialog } from '@/components/vsual/new-lead-dialog';
import { LeadDetailSheet } from '@/components/vsual/lead-detail-sheet';
import { useVSUALStore } from '@/lib/store';
import { Zap } from 'lucide-react';

const viewComponents: Record<string, React.ComponentType> = {
  dashboard: DashboardView,
  pipeline: PipelineView,
  leads: LeadsView,
  tasks: TasksView,
  automation: AutomationView,
  alerts: AlertsView,
};

export default function Home() {
  const { currentView, sidebarOpen, setSidebarOpen } = useVSUALStore();
  const CurrentViewComponent = viewComponents[currentView] ?? DashboardView;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Mobile sidebar overlay */}
      <MobileSidebarOverlay open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <CurrentViewComponent />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 px-4 py-3 mt-auto">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-primary" />
              <span className="font-semibold">VSUAL OS v1.0</span>
            </div>
            <span>&copy; {new Date().getFullYear()} VSUAL. All rights reserved.</span>
          </div>
        </footer>
      </div>

      {/* Dialogs */}
      <NewLeadDialog />
      <LeadDetailSheet />
    </div>
  );
}
