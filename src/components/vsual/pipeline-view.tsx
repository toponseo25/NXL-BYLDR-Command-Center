'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useVSUALStore } from '@/lib/store';
import { getLeads, updateLeadStage } from '@/lib/api';
import type { Lead } from '@/lib/types';
import { PIPELINE_STAGES, getStageBgClass, getTimeAgo } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Clock, Palette, Flame } from 'lucide-react';

function PipelineColumn({ stage, leads, onSelect }: { stage: typeof PIPELINE_STAGES[number]; leads: Lead[]; onSelect: (l: Lead) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-shrink-0 w-[280px] md:w-[300px] flex flex-col rounded-xl transition-colors',
        isOver ? 'bg-accent/60' : 'bg-muted/30'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 p-3 pb-2">
        <div className={cn('h-2.5 w-2.5 rounded-full', stage.bgClass)} />
        <h3 className="text-sm font-semibold flex-1">{stage.label}</h3>
        <Badge variant="secondary" className="h-5 min-w-[22px] justify-center text-[10px]">
          {leads.length}
        </Badge>
      </div>

      {/* Column Body */}
      <ScrollArea className="flex-1 max-h-[calc(100vh-220px)] px-2 pb-2">
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {leads.map((lead) => (
              <PipelineCard key={lead.id} lead={lead} stage={stage} onSelect={onSelect} />
            ))}
          </AnimatePresence>
          {leads.length === 0 && (
            <div className="flex items-center justify-center h-20 text-xs text-muted-foreground rounded-lg border border-dashed border-border">
              No leads
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function PipelineCard({ lead, stage, onSelect }: { lead: Lead; stage: typeof PIPELINE_STAGES[number]; onSelect: (l: Lead) => void }) {
  const isHot = lead.stage === 'hot_lead';

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={cn(
          'cursor-grab active:cursor-grabbing rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition-all',
          isDragging && 'opacity-50 shadow-lg rotate-2',
          isHot && 'border-red-500/50 shadow-red-500/10 shadow-md'
        )}
        onClick={() => onSelect(lead)}
      >
        {isHot && (
          <div className="absolute -top-1 -right-1">
            <span className="text-base">🔥</span>
          </div>
        )}
        <p className="font-medium text-sm truncate">{lead.name}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{lead.businessName}</p>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge variant="outline" className="text-[10px] font-normal">
            {lead.serviceType}
          </Badge>
          {lead.mockupReady && (
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] gap-1">
              <Palette className="h-2.5 w-2.5" /> Mockup
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {getTimeAgo(lead.createdAt)}
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {lead.assignedTo}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}

function DragOverlayCard({ lead }: { lead: Lead | null }) {
  if (!lead) return null;
  const isHot = lead.stage === 'hot_lead';
  return (
    <div className={cn(
      'w-[280px] rounded-lg border bg-card p-3 shadow-xl',
      isHot && 'border-red-500/50'
    )}>
      <p className="font-medium text-sm">{lead.name}</p>
      <p className="text-xs text-muted-foreground">{lead.businessName}</p>
    </div>
  );
}

export function PipelineView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const { selectLead } = useVSUALStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const fetchLeads = useCallback(() => {
    getLeads()
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const getLeadsByStage = (stageKey: string) => leads.filter(l => l.stage === stageKey);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const lead = leads.find(l => l.id === active.id);
    setActiveLead(lead || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveLead(null);

    if (!over) return;
    const lead = leads.find(l => l.id === active.id);
    if (!lead || lead.stage === over.id) return;

    try {
      await updateLeadStage(lead.id, over.id as string);
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, stage: over.id as string } : l));
    } catch {
      // revert handled by setLeads not being called
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {PIPELINE_STAGES.map(s => (
            <div key={s.key} className="flex-shrink-0 w-[280px]">
              <Skeleton className="h-8 w-32 mb-3" />
              <Skeleton className="h-28 w-full mb-2" />
              <Skeleton className="h-28 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col p-4 md:p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className="flex-1">
          <div className="flex gap-4 pb-4 min-h-full">
            {PIPELINE_STAGES.map(stage => (
              <PipelineColumn
                key={stage.key}
                stage={stage}
                leads={getLeadsByStage(stage.key)}
                onSelect={selectLead}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DragOverlay>
          <DragOverlayCard lead={activeLead} />
        </DragOverlay>
      </DndContext>
    </div>
  );
}
