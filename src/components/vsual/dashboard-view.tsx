'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Flame,
  Zap,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useVSUALStore } from '@/lib/store';
import { getDashboardStats } from '@/lib/api';
import type { DashboardStats } from '@/lib/types';
import { getStageLabel, getStageBgClass, getTimeAgo, PIPELINE_STAGES } from '@/lib/constants';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, Cell } from 'recharts';

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const chartConfig = {
  count: { label: 'Leads', color: '#10b981' },
} satisfies ChartConfig;

export function DashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentView, selectLead } = useVSUALStore();

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => {
        // Fallback mock data if API not ready
        setStats({
          totalLeads: 12,
          newLeads: 3,
          hotLeads: 2,
          leadsByStage: {
            new_lead: 2, mockup_needed: 1, mockup_sent: 1, engaged: 2,
            video_sent: 1, proof_stage: 1, hot_lead: 2, call_scheduled: 1,
            closed_won: 0, closed_lost: 0, retention: 1,
          },
          pendingTasks: 5,
          urgentTasks: 1,
          activeAutomations: 4,
          stuckLeads: [],
          recentActivities: [],
          conversionRate: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const chartData = PIPELINE_STAGES
    .filter(s => stats?.leadsByStage[s.key])
    .map(s => ({
      name: s.label,
      stage: s.key,
      count: stats?.leadsByStage[s.key] || 0,
      fill: s.color,
    }));

  const kpiCards = [
    { title: 'Total Leads', value: stats?.totalLeads ?? 0, icon: Users, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { title: 'Hot Leads', value: stats?.hotLeads ?? 0, icon: Flame, color: 'text-red-500', bgColor: 'bg-red-500/10' },
    { title: 'Active Automations', value: stats?.activeAutomations ?? 0, icon: Zap, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { title: 'Conversion Rate', value: stats?.conversionRate != null ? `${Math.round(stats.conversionRate * 100)}%` : '—', icon: TrendingUp, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiCards.map((kpi, i) => (
          <motion.div key={kpi.title} {...fadeIn} transition={{ delay: i * 0.05 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold md:text-3xl">{kpi.value}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${kpi.bgColor}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pipeline Distribution Chart */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pipeline Distribution</CardTitle>
              <CardDescription>Leads across all pipeline stages</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 11 }}
                      width={100}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                      {chartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div {...fadeIn} transition={{ delay: 0.25 }} className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Task Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <Badge variant="secondary">{stats?.pendingTasks ?? '—'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Urgent</span>
                <Badge className="bg-red-500 text-white">{stats?.urgentTasks ?? '—'}</Badge>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => setCurrentView('tasks')}
              >
                View all tasks <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setCurrentView('pipeline')}>
                <Activity className="h-4 w-4" /> View Pipeline
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setCurrentView('automation')}>
                <Zap className="h-4 w-4" /> Manage Automations
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setCurrentView('alerts')}>
                <AlertTriangle className="h-4 w-4" /> View Alerts
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest actions across the system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : stats?.recentActivities && stats.recentActivities.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {stats.recentActivities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="mt-0.5 rounded-full bg-muted p-1.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{getTimeAgo(activity.createdAt)}</p>
                    </div>
                    {activity.leadId && (
                      <Badge variant="outline" className="text-[10px] shrink-0">{activity.type}</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No recent activities</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stuck Leads */}
      {stats?.stuckLeads && stats.stuckLeads.length > 0 && (
        <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Stuck Leads
              </CardTitle>
              <CardDescription>Leads that haven&apos;t moved in a while</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stats.stuckLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="cursor-pointer rounded-lg border border-border bg-card p-3 hover:shadow-md transition-all"
                    onClick={() => selectLead(lead)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{lead.name}</p>
                      <Badge className={`${getStageBgClass(lead.stage)} text-white text-[10px]`}>
                        {getStageLabel(lead.stage)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{lead.businessName}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
