'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Eye,
  Trash2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVSUALStore } from '@/lib/store';
import { getLeads, deleteLead } from '@/lib/api';
import type { Lead } from '@/lib/types';
import { PIPELINE_STAGES, SERVICE_TYPES, getStageBgClass, getTimeAgo } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type SortField = 'name' | 'businessName' | 'stage' | 'createdAt';
type SortDir = 'asc' | 'desc';

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (sortField !== field) return <ChevronDown className="h-3 w-3 ml-1 opacity-30" />;
  return sortDir === 'asc' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />;
}

export function LeadsView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [assignedFilter, setAssignedFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const { selectLead, setCurrentView } = useVSUALStore();

  useEffect(() => {
    getLeads()
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      toast.success('Lead deleted');
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.businessName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q)
      );
    }

    // Filters
    if (stageFilter !== 'all') result = result.filter(l => l.stage === stageFilter);
    if (assignedFilter !== 'all') result = result.filter(l => l.assignedTo === assignedFilter);
    if (serviceFilter !== 'all') result = result.filter(l => l.serviceType === serviceFilter);

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [leads, search, stageFilter, assignedFilter, serviceFilter, sortField, sortDir]);



  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {PIPELINE_STAGES.map(s => (
              <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={assignedFilter} onValueChange={setAssignedFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Assigned" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Sal">Sal</SelectItem>
            <SelectItem value="Geo">Geo</SelectItem>
          </SelectContent>
        </Select>

        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {SERVICE_TYPES.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Badge variant="secondary" className="self-center">
          {filteredLeads.length} leads
        </Badge>
      </motion.div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                    <span className="flex items-center">Name <SortIcon field="name" sortField={sortField} sortDir={sortDir} /></span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none hidden md:table-cell" onClick={() => handleSort('businessName')}>
                    <span className="flex items-center">Business <SortIcon field="businessName" sortField={sortField} sortDir={sortDir} /></span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('stage')}>
                    <span className="flex items-center">Stage <SortIcon field="stage" sortField={sortField} sortDir={sortDir} /></span>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Service</TableHead>
                  <TableHead className="hidden sm:table-cell">Assigned</TableHead>
                  <TableHead className="hidden lg:table-cell">Mockup</TableHead>
                  <TableHead className="cursor-pointer select-none hidden sm:table-cell" onClick={() => handleSort('createdAt')}>
                    <span className="flex items-center">Created <SortIcon field="createdAt" sortField={sortField} sortDir={sortDir} /></span>
                  </TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No leads found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => selectLead(lead)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-medium text-sm">{lead.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{lead.businessName}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{lead.businessName}</TableCell>
                      <TableCell>
                        <Badge className={cn(getStageBgClass(lead.stage), 'text-white text-[10px]')}>
                          {PIPELINE_STAGES.find(s => s.key === lead.stage)?.label ?? lead.stage}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline" className="text-[10px]">{lead.serviceType}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{lead.assignedTo}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {lead.mockupReady ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Ready</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {getTimeAgo(lead.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); selectLead(lead); }}>
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => handleDelete(lead.id, e)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
