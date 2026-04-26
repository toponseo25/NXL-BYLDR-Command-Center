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
import { NxlCommandCenter } from '@/components/nxl/nxl-command-center';
import { LandingPage } from '@/components/portal/landing-page';
import { LoginPage } from '@/components/portal/login-page';
import { useVSUALStore } from '@/lib/store';
import Image from 'next/image';

const viewComponents: Record<string, React.ComponentType> = {
  dashboard: DashboardView,
  pipeline: PipelineView,
  leads: LeadsView,
  tasks: TasksView,
  automation: AutomationView,
  alerts: AlertsView,
};

function VsualApp() {
  const { currentView, sidebarOpen, setSidebarOpen } = useVSUALStore();
  const CurrentViewComponent = viewComponents[currentView] ?? DashboardView;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MobileSidebarOverlay open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Sidebar />
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
        <footer className="border-t border-border bg-card/50 px-4 py-3 mt-auto">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Image src="/vsual-logo.png" alt="VSUAL" width={16} height={16} className="h-4 w-4 rounded" />
              <span className="font-semibold">VSUAL OS v1.0</span>
            </div>
            <span>&copy; {new Date().getFullYear()} VSUAL Digital Media. All rights reserved.</span>
          </div>
        </footer>
      </div>
      <NewLeadDialog />
      <LeadDetailSheet />
    </div>
  );
}

function AppRouter() {
  const { appMode } = useVSUALStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={appMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        {appMode === 'landing' && <LandingPage />}
        {appMode === 'vsual-login' && <LoginPage mode="vsual-login" />}
        {appMode === 'nxl-login' && <LoginPage mode="nxl-login" />}
        {appMode === 'vsual' && <VsualApp />}
        {appMode === 'nxl' && <NxlCommandCenter />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Home() {
  return <AppRouter />;
}
