'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVSUALStore } from '@/lib/store';
import { createLead } from '@/lib/api';
import { SERVICE_TYPES } from '@/lib/constants';
import { toast } from 'sonner';

export function NewLeadDialog() {
  const { newLeadDialogOpen, setNewLeadDialogOpen, currentUser } = useVSUALStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    serviceType: '',
  });

  const resetForm = () => {
    setForm({ name: '', businessName: '', phone: '', email: '', serviceType: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.businessName || !form.serviceType) {
      toast.error('Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      await createLead({
        ...form,
        assignedTo: currentUser,
        tags: 'CA_BYLDR_LEAD',
      });
      toast.success('Lead created successfully!', {
        description: `${form.name} from ${form.businessName} has been added.`,
      });
      resetForm();
      setNewLeadDialogOpen(false);
    } catch {
      toast.error('Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={newLeadDialogOpen} onOpenChange={(open) => {
      setNewLeadDialogOpen(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Add a new lead to the pipeline. They will start in the &quot;New Lead&quot; stage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="John Smith"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              placeholder="Acme Corp"
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@acme.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type *</Label>
            <Select
              value={form.serviceType}
              onValueChange={(v) => setForm({ ...form, serviceType: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-muted-foreground">
            Assigned to: <span className="font-medium text-foreground">{currentUser}</span>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setNewLeadDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !form.name || !form.businessName || !form.serviceType}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
