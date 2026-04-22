export const PIPELINE_STAGES = [
  { key: 'new_lead', label: 'New Lead', color: '#6b7280', bgClass: 'bg-gray-500', textClass: 'text-gray-500', borderClass: 'border-gray-500', description: 'Fresh lead added to the system' },
  { key: 'mockup_needed', label: 'Mockup Needed', color: '#f97316', bgClass: 'bg-orange-500', textClass: 'text-orange-500', borderClass: 'border-orange-500', description: 'Mockup design needs to be created' },
  { key: 'mockup_sent', label: 'Mockup Sent', color: '#eab308', bgClass: 'bg-yellow-500', textClass: 'text-yellow-600', borderClass: 'border-yellow-500', description: 'Mockup has been sent to the client' },
  { key: 'engaged', label: 'Engaged', color: '#06b6d4', bgClass: 'bg-cyan-500', textClass: 'text-cyan-500', borderClass: 'border-cyan-500', description: 'Client is actively engaged' },
  { key: 'video_sent', label: 'Video Sent', color: '#14b8a6', bgClass: 'bg-teal-500', textClass: 'text-teal-500', borderClass: 'border-teal-500', description: 'Sales video has been delivered' },
  { key: 'proof_stage', label: 'Proof Stage', color: '#10b981', bgClass: 'bg-emerald-500', textClass: 'text-emerald-500', borderClass: 'border-emerald-500', description: 'Showing proof of results' },
  { key: 'hot_lead', label: 'Hot Lead', color: '#ef4444', bgClass: 'bg-red-500', textClass: 'text-red-500', borderClass: 'border-red-500', description: '🔥 Hot lead - ready to close!' },
  { key: 'call_scheduled', label: 'Call Scheduled', color: '#f59e0b', bgClass: 'bg-amber-500', textClass: 'text-amber-500', borderClass: 'border-amber-500', description: 'Sales call has been scheduled' },
  { key: 'closed_won', label: 'Closed Won', color: '#22c55e', bgClass: 'bg-green-500', textClass: 'text-green-500', borderClass: 'border-green-500', description: 'Deal closed successfully! 🎉' },
  { key: 'closed_lost', label: 'Closed Lost', color: '#64748b', bgClass: 'bg-slate-500', textClass: 'text-slate-500', borderClass: 'border-slate-500', description: 'Deal was lost' },
  { key: 'retention', label: 'Retention', color: '#a855f7', bgClass: 'bg-purple-500', textClass: 'text-purple-500', borderClass: 'border-purple-500', description: 'Client in retention phase' },
] as const;

export const AUTOMATION_STEPS = [
  { day: 1, title: 'Welcome & Intro', description: 'Send welcome email with company intro and next steps', type: 'email' },
  { day: 2, title: 'Social Proof Package', description: 'Send case studies and testimonials from similar businesses', type: 'email' },
  { day: 4, title: 'Industry Insights', description: 'Share relevant industry report or market analysis', type: 'email' },
  { day: 6, title: 'Video Follow-Up', description: 'Send personalized video message or demo', type: 'video' },
  { day: 8, title: 'Exclusive Offer', description: 'Present special limited-time offer or pricing incentive', type: 'email' },
  { day: 11, title: 'Urgency Push', description: 'Final follow-up with scarcity elements', type: 'call' },
  { day: 14, title: 'Final Touchpoint', description: 'Last attempt - direct outreach for decision', type: 'call' },
] as const;

export const SERVICE_TYPES = [
  'Roofing',
  'Plumbing',
  'HVAC',
  'Landscaping',
  'Electrician',
  'Painting',
  'Remodeling',
  'Cleaning',
  'Website Design',
  'Social Media Marketing',
  'Google Ads',
  'SEO Optimization',
  'Full Digital Package',
] as const;

export const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-black',
  low: 'bg-green-500 text-white',
};

export const STAGE_ORDER = [
  'new_lead',
  'mockup_needed',
  'mockup_sent',
  'engaged',
  'video_sent',
  'proof_stage',
  'hot_lead',
  'call_scheduled',
  'closed_won',
  'closed_lost',
  'retention',
] as const;

export function getStageLabel(key: string): string {
  return PIPELINE_STAGES.find(s => s.key === key)?.label ?? key;
}

export function getStageColor(key: string): string {
  return PIPELINE_STAGES.find(s => s.key === key)?.color ?? '#6b7280';
}

export function getStageBgClass(key: string): string {
  return PIPELINE_STAGES.find(s => s.key === key)?.bgClass ?? 'bg-gray-500';
}

export function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 2592000)}mo ago`;
}

export function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}
