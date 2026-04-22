'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  Building2,
  Tag,
  Palette,
  Zap,
  Clock,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVSUALStore } from '@/lib/store';
import { getLead, updateLeadStage, markMockupReady, updateLead } from '@/lib/api';
import type { Lead } from '@/lib/types';
import {
  PIPELINE_STAGES,
  AUTOMATION_STEPS,
  STAGE_ORDER,
  getStageLabel,
  getStageBgClass,
  getTimeAgo,
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function LeadDetailSheet() {
  const { selectedLead, leadDetailOpen, setLeadDetailOpen, selectLead, setCurrentView } = useVSUALStore();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [stageLoading, setStageLoading] = useState(false);
  const [mockupLoading, setMockupLoading] = useState(false);

  useEffect(() => {
    if (leadDetailOpen && selectedLead) {
      setLoading(true);
      getLead(selectedLead.id)
        .then(setLead)
        .catch(() => setLead(selectedLead))
        .finally(() => setLoading(false));
    } else if (!leadDetailOpen) {
      setLead(null);
    }
  }, [leadDetailOpen, selectedLead]);

  const currentStageIdx = lead ? STAGE_ORDER.indexOf(lead.stage as typeof STAGE_ORDER[number]) : -1;
  const stageProgress = currentStageIdx >= 0 ? ((currentStageIdx + 1) / STAGE_ORDER.length) * 100 : 0;

  const handleStageChange = async (newStage: string) => {
    if (!lead) return;
    setStageLoading(true);
    try {
      const updated = await updateLeadStage(lead.id, newStage);
      setLead(updated);
      toast.success(`Stage updated to "${getStageLabel(newStage)}"`);
    } catch {
      toast.error('Failed to update stage');
    } finally {
      setStageLoading(false);
    }
  };

  const handleMockupReady = async () => {
    if (!lead) return;
    setMockupLoading(true);
    try {
      const updated = await markMockupReady(lead.id);
      setLead(updated);
      toast.success('Mockup marked as ready! 🎨');
    } catch {
      toast.error('Failed to mark mockup ready');
    } finally {
      setMockupLoading(false);
    }
  };

  const nextStage = currentStageIdx >= 0 && currentStageIdx < STAGE_ORDER.length - 1
    ? STAGE_ORDER[currentStageIdx + 1]
    : null;

  if (!leadDetailOpen) return null;

  return (
    <Sheet open={leadDetailOpen} onOpenChange={setLeadDetailOpen}>
      <SheetContent className="w-full sm:max-w-[560px] p-0">
        <SheetHeader className="p-6 pb-4">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : lead ? (
            <>
              <SheetTitle className="text-xl">{lead.name}</SheetTitle>
              <SheetDescription>{lead.businessName}</SheetDescription>
            </>
          ) : null}
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="px-6 pb-8 space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : lead ? (
              <>
                {/* Contact Info */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-lg border p-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{lead.phone || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border p-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Email</p>
                      <p className="text-sm font-medium truncate">{lead.email || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border p-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Service</p>
                      <p className="text-sm font-medium">{lead.serviceType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border p-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Tags</p>
                      <p className="text-sm font-medium">{lead.tags}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pipeline Stage */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Pipeline Stage</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={cn(getStageBgClass(lead.stage), 'text-white')}>
                        {getStageLabel(lead.stage)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{Math.round(stageProgress)}%</span>
                    </div>
                    <Progress value={stageProgress} className="h-2" />

                    {/* Stage dots */}
                    <div className="flex gap-1 mt-2">
                      {STAGE_ORDER.map((stage) => (
                        <div
                          key={stage}
                          className={cn(
                            'h-1.5 flex-1 rounded-full transition-colors',
                            STAGE_ORDER.indexOf(stage) <= currentStageIdx
                              ? getStageBgClass(stage)
                              : 'bg-muted'
                          )}
                          title={getStageLabel(stage)}
                        />
                      ))}
                    </div>

                    {/* Change Stage */}
                    <div className="flex items-center gap-2 mt-3">
                      <Select
                        value={lead.stage}
                        onValueChange={handleStageChange}
                        disabled={stageLoading}
                      >
                        <SelectTrigger className="flex-1 text-xs">
                          {stageLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {PIPELINE_STAGES.map(s => (
                            <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {nextStage && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-xs"
                          onClick={() => handleStageChange(nextStage)}
                          disabled={stageLoading}
                        >
                          Advance <ArrowRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Automation Status */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" /> Automation Status
                  </h4>
                  {lead.automationStarted ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Day {lead.automationDay} of 14</span>
                        <Badge variant="secondary" className="text-[10px]">Active</Badge>
                      </div>
                      <Progress value={(lead.automationDay / 14) * 100} className="h-1.5" />
                      <div className="flex gap-1 flex-wrap">
                        {AUTOMATION_STEPS.map(step => (
                          <Badge
                            key={step.day}
                            variant="outline"
                            className={cn(
                              'text-[10px]',
                              lead.automationDay >= step.day
                                ? 'border-amber-500/50 bg-amber-500/10 text-amber-600'
                                : 'text-muted-foreground'
                            )}
                          >
                            Day {step.day} ✓
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Automation not started
                    </div>
                  )}
                </div>

                <Separator />

                {/* Mockup Status */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Palette className="h-4 w-4" /> Mockup Status
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {lead.mockupReady ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="text-sm">{lead.mockupReady ? 'Mockup Ready' : 'Mockup Pending'}</span>
                    </div>
                    {!lead.mockupReady && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        onClick={handleMockupReady}
                        disabled={mockupLoading}
                      >
                        {mockupLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        Mark Ready
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Related Tasks */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Related Tasks</h4>
                  {lead.tasks && lead.tasks.length > 0 ? (
                    <div className="space-y-2">
                      {lead.tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-2 rounded-lg border p-2.5">
                          <div className={cn(
                            'h-2 w-2 rounded-full',
                            task.status === 'completed' ? 'bg-emerald-500' : 'bg-muted-foreground'
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-sm',
                              task.status === 'completed' && 'line-through text-muted-foreground'
                            )}>
                              {task.title}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-[10px]">{task.priority}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No related tasks</p>
                  )}
                </div>

                {/* Activity Timeline */}
                {lead.activities && lead.activities.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Activity Timeline</h4>
                      <div className="space-y-3">
                        {lead.activities.map((activity) => (
                          <div key={activity.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                              <div className="w-px flex-1 bg-border" />
                            </div>
                            <div className="pb-3">
                              <p className="text-sm">{activity.message}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {getTimeAgo(activity.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Notes */}
                {lead.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" /> Notes
                      </h4>
                      <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                        {lead.notes}
                      </div>
                    </div>
                  </>
                )}

                {/* Timestamps */}
                <Separator />
                <div className="flex gap-4 text-[10px] text-muted-foreground">
                  <span>Created: {new Date(lead.createdAt).toLocaleString()}</span>
                  <span>Updated: {new Date(lead.updatedAt).toLocaleString()}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No lead selected</p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
