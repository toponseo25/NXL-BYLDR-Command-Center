export interface Lead {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  serviceType: string;
  stage: string;
  assignedTo: string;
  tags: string;
  mockupReady: boolean;
  automationStarted: boolean;
  automationDay: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
  activities?: Activity[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignedTo: string;
  leadId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  lead?: Lead;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  leadId?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  hotLeads: number;
  leadsByStage: Record<string, number>;
  pendingTasks: number;
  urgentTasks: number;
  activeAutomations: number;
  stuckLeads: Lead[];
  recentActivities: Activity[];
  conversionRate: number;
}

export type ViewType = 'dashboard' | 'pipeline' | 'leads' | 'tasks' | 'automation' | 'alerts';

export type StageKey =
  | 'new_lead'
  | 'mockup_needed'
  | 'mockup_sent'
  | 'engaged'
  | 'video_sent'
  | 'proof_stage'
  | 'hot_lead'
  | 'call_scheduled'
  | 'closed_won'
  | 'closed_lost'
  | 'retention';
