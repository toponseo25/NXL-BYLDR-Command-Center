import { create } from 'zustand';
import type { ViewType, Lead } from './types';

interface VSUALStore {
  appMode: 'landing' | 'vsual-login' | 'vsual' | 'nxl-login' | 'nxl';
  currentView: ViewType;
  sidebarOpen: boolean;
  selectedLead: Lead | null;
  newLeadDialogOpen: boolean;
  currentUser: 'Sal' | 'Geo';
  leadDetailOpen: boolean;
  nxlProjectId: string | null;

  setAppMode: (mode: VSUALStore['appMode']) => void;
  logout: () => void;
  setCurrentView: (view: ViewType) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  selectLead: (lead: Lead | null) => void;
  setNewLeadDialogOpen: (open: boolean) => void;
  setCurrentUser: (user: 'Sal' | 'Geo') => void;
  setLeadDetailOpen: (open: boolean) => void;
  setNxlProjectId: (id: string | null) => void;
}

export const useVSUALStore = create<VSUALStore>((set) => ({
  appMode: 'landing',
  currentView: 'dashboard',
  sidebarOpen: false,
  selectedLead: null,
  newLeadDialogOpen: false,
  currentUser: 'Sal',
  leadDetailOpen: false,
  nxlProjectId: null,

  setAppMode: (mode) => set({ appMode: mode }),
  logout: () => set({ appMode: 'landing' }),
  setCurrentView: (view) => set({ currentView: view }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  selectLead: (lead) => set({ selectedLead: lead, leadDetailOpen: !!lead }),
  setNewLeadDialogOpen: (open) => set({ newLeadDialogOpen: open }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setLeadDetailOpen: (open) => set({ leadDetailOpen: open }),
  setNxlProjectId: (id) => set({ nxlProjectId: id }),
}));
