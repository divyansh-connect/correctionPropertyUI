import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from '@tanstack/react-router';
import api from '../../api';
import { useAuthStore } from '../../store/useStore';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { StatusBadge } from '../../components/StatusBadge';
import { 
  Wrench, Calendar, DollarSign, CheckCircle2, Clipboard, 
  Clock, Search, Eye, Play, Check, AlertCircle, XCircle, X,
  AlertTriangle, FileText, MapPin
} from 'lucide-react';

export const StaffMaintenancePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we are on the Completed Tasks (History) view
  const isCompletedView = location.pathname.includes('/completed');

  const [searchQuery, setSearchQuery] = useState('');
  const [localWorkOrders, setLocalWorkOrders] = useState<any[]>([]);

  // Modals state
  const [rejectTaskId, setRejectTaskId] = useState<string | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('');

  const [completeTaskId, setCompleteTaskId] = useState<string | null>(null);
  const [actualCostVal, setActualCostVal] = useState<string>('');
  const [extraExpensesVal, setExtraExpensesVal] = useState<string>('');
  const [resolutionNotesVal, setResolutionNotesVal] = useState('');

  // Fetch all work orders
  const { data: allWorkOrders = [], isLoading } = useQuery({
    queryKey: ['staff-work-orders-v2'],
    queryFn: () => api.workOrders.getAll(),
  });

  // Filter orders assigned to this technician
  const myWorkOrders = allWorkOrders.filter(
    (w: any) => w.assignedTechnician === user?.name
  );

  useEffect(() => {
    if (myWorkOrders.length && !localWorkOrders.length) {
      setLocalWorkOrders(myWorkOrders);
    }
  }, [myWorkOrders, localWorkOrders]);

  // Apply search query and status filtering
  const filteredWorkOrders = localWorkOrders.filter((order: any) => {
    const isCompletedStatus = ['Completed', 'Closed', 'Rejected', 'Cancelled'].includes(order.status);
    const matchesStatus = isCompletedView ? isCompletedStatus : !isCompletedStatus;

    const matchesSearch = 
      order.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.issue && order.issue.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch && matchesStatus;
  });

  // Interactive UI triggers
  const handleAccept = (orderId: string) => {
    setLocalWorkOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: 'Assigned' } : o)
    );
  };

  const handleStartWork = (orderId: string) => {
    setLocalWorkOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: 'In Progress' } : o)
    );
  };

  // Reject Submit Handler
  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectTaskId) return;

    setLocalWorkOrders(prev => 
      prev.map(o => o.id === rejectTaskId ? { 
        ...o, 
        status: 'Rejected', 
        rejectReason: rejectReasonText || 'No reason provided'
      } : o)
    );
    
    // Reset modal
    setRejectTaskId(null);
    setRejectReasonText('');
  };

  // Completion Submit Handler
  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeTaskId) return;

    const actual = actualCostVal ? Number(actualCostVal) : 0;
    const extra = extraExpensesVal ? Number(extraExpensesVal) : 0;

    setLocalWorkOrders(prev => 
      prev.map(o => o.id === completeTaskId ? { 
        ...o, 
        status: 'Completed', 
        actualCost: actual,
        extraExpenses: extra,
        resolutionNotes: resolutionNotesVal || 'Repairs completed.'
      } : o)
    );

    // Reset modal
    setCompleteTaskId(null);
    setActualCostVal('');
    setExtraExpensesVal('');
    setResolutionNotesVal('');
  };

  if (isLoading) {
    return <LoadingSkeleton type="card" />;
  }

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title={isCompletedView ? "Work History" : "My Work Orders"}
        description={
          isCompletedView 
            ? "Track completed or rejected jobs, actual repair costs, and resolution details." 
            : "Accept assignments, execute field operations, and update task statuses."
        }
        breadcrumbs={[
          { label: 'Portal', href: '/staff/dashboard' },
          { label: isCompletedView ? 'Work History' : 'My Tasks' },
        ]}
      />

      {/* SEARCH BAR */}
      <div className="flex gap-3.5 p-4 bg-card border rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by ID, property, or issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>

      {/* TASK LIST CARDS (CARD PATTERN) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground">
            {isCompletedView ? "Archived Logs" : "Active Tasks"} ({filteredWorkOrders.length})
          </h3>
        </div>
        
        {filteredWorkOrders.length === 0 ? (
          <Card className="p-12 text-center border bg-card">
            <Clipboard className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-xs text-muted-foreground font-semibold">No work orders matching your filters at this time.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredWorkOrders.map((order: any) => {
              const priorityBorderColor = 
                order.priority === 'Urgent' ? 'border-l-rose-500' :
                order.priority === 'High' ? 'border-l-amber-500' :
                order.priority === 'Medium' ? 'border-l-blue-500' :
                'border-l-emerald-500';

              return (
                <Card 
                  key={order.id} 
                  className={`p-5 border border-l-4 ${priorityBorderColor} bg-card hover:shadow-md transition-all duration-200 group relative overflow-hidden`}
                >
                  <div className="space-y-3.5">
                    {/* Top Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-black text-primary text-xs uppercase bg-primary/10 px-2 py-0.5 rounded">
                          {order.workOrderNumber}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      
                      {order.priority && (
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          order.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-500 border-rose-500/25' :
                          order.priority === 'High' ? 'bg-amber-500/10 text-amber-500 border-amber-500/25' :
                          order.priority === 'Medium' ? 'bg-blue-500/10 text-blue-500 border-blue-500/25' :
                          'bg-emerald-500/10 text-emerald-500 border-emerald-500/25'
                        }`}>
                          {order.priority} Priority
                        </span>
                      )}
                    </div>

                    {/* Location & Title */}
                    <div className="space-y-1">
                      <h4 className="font-black text-base text-foreground group-hover:text-primary transition-colors duration-200">
                        {order.issue || 'Standard Maintenance Task'}
                      </h4>
                      <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        {order.propertyName} • <span className="text-foreground">Unit {order.unitNumber}</span>
                      </p>
                      {order.description && (
                        <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-1.5 leading-relaxed font-medium">
                          {order.description}
                        </p>
                      )}
                    </div>

                    {/* Metric Grid Box */}
                    <div className="grid grid-cols-2 gap-4 bg-secondary/15 p-3.5 rounded-2xl border border-border/40 text-xs font-bold">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                          <DollarSign className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-muted-foreground uppercase text-[8px] tracking-wider leading-none">Est. Budget</p>
                          <p className="text-foreground mt-0.5 text-xs font-extrabold">${order.estimatedCost}</p>
                        </div>
                      </div>

                      {isCompletedView ? (
                        <div className="flex items-center space-x-2 border-l pl-4 border-border/30">
                          <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-muted-foreground uppercase text-[8px] tracking-wider leading-none">Final Cost</p>
                            <p className="text-emerald-500 mt-0.5 text-xs font-extrabold">
                              ${order.actualCost}
                              {order.extraExpenses > 0 && <span className="text-[9px] text-muted-foreground font-semibold"> (+${order.extraExpenses})</span>}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 border-l pl-4 border-border/30">
                          <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-muted-foreground uppercase text-[8px] tracking-wider leading-none">Sch. Date</p>
                            <p className="text-foreground mt-0.5 text-xs font-extrabold">{order.scheduledDate || 'TBD'}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reject Info Box */}
                    {order.status === 'Rejected' && order.rejectReason && (
                      <div className="p-3 bg-rose-500/5 border border-rose-500/20 text-rose-500 rounded-xl text-[11px] font-semibold space-y-0.5">
                        <p className="uppercase text-[8px] text-muted-foreground font-bold tracking-wide">Reason for Rejection</p>
                        <p className="leading-relaxed italic">"{order.rejectReason}"</p>
                      </div>
                    )}

                    {/* Resolution Info Box */}
                    {order.status === 'Completed' && order.resolutionNotes && (
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 rounded-xl text-[11px] font-semibold space-y-0.5">
                        <p className="uppercase text-[8px] text-muted-foreground font-bold tracking-wide">Resolution Summary</p>
                        <p className="leading-relaxed italic">"{order.resolutionNotes}"</p>
                      </div>
                    )}
                  </div>
                  {/* Card footer action buttons */}
                  <div className="mt-5 pt-3.5 border-t border-border/40 flex justify-between items-center gap-2">
                    <div className="flex gap-2.5">
                      {/* UI-only actions */}
                      {order.status === 'New' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleAccept(order.id)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/95 transition-all shadow-sm"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectTaskId(order.id)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-all"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {(order.status === 'Assigned' || order.status === 'Scheduled' || order.status === 'Draft') && (
                        <button
                          type="button"
                          onClick={() => handleStartWork(order.id)}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-sm shadow-amber-500/15"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" /> Start Work
                        </button>
                      )}

                      {order.status === 'In Progress' && (
                        <button
                          type="button"
                          onClick={() => {
                            setCompleteTaskId(order.id);
                            setActualCostVal(order.estimatedCost.toString());
                          }}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-sm shadow-emerald-500/15"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark Completed
                        </button>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate({ to: `/staff/tasks/${order.id}` })}
                      className="flex items-center gap-1 h-9 font-bold px-3.5 rounded-xl text-[11px] border bg-background hover:bg-secondary/35 text-foreground"
                    >
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" /> Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* REJECT DIALOG MODAL */}
      {rejectTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-200 text-foreground">
            <button
              onClick={() => setRejectTaskId(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary/40 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 text-rose-500 font-extrabold text-sm border-b pb-3 uppercase tracking-wide">
              <AlertTriangle className="w-5 h-5" />
              <h3>Reject Work Assignment</h3>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-muted-foreground font-bold text-[10px] uppercase">Reason for Rejection</label>
                <textarea
                  required
                  rows={3}
                  value={rejectReasonText}
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  placeholder="Please state why you are rejecting this task (e.g. materials unavailable, conflicts with existing schedule, incorrect dispatch)..."
                  className="w-full rounded-xl border bg-background p-3.5 border-border/80 focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl h-10 font-bold"
                  onClick={() => setRejectTaskId(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl h-10 font-bold bg-rose-500 text-white hover:bg-rose-600"
                >
                  Confirm Reject
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLETION DETAIL MODAL */}
      {completeTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-200 text-foreground">
            <button
              onClick={() => setCompleteTaskId(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary/40 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 text-emerald-500 font-extrabold text-sm border-b pb-3 uppercase tracking-wide">
              <CheckCircle2 className="w-5 h-5" />
              <h3>Record Job Resolution</h3>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                {/* Actual repair cost */}
                <div className="space-y-1">
                  <label className="text-muted-foreground font-bold text-[10px] uppercase">Labor / Base Cost ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      required
                      value={actualCostVal}
                      onChange={(e) => setActualCostVal(e.target.value)}
                      className="pl-8 h-10 rounded-xl"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Extra Expenses */}
                <div className="space-y-1">
                  <label className="text-muted-foreground font-bold text-[10px] uppercase">Extra Expenses / Materials ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={extraExpensesVal}
                      onChange={(e) => setExtraExpensesVal(e.target.value)}
                      className="pl-8 h-10 rounded-xl"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Resolution Notes */}
              <div className="space-y-1">
                <label className="text-muted-foreground font-bold text-[10px] uppercase">Materials Used / Resolution Notes</label>
                <textarea
                  rows={4}
                  value={resolutionNotesVal}
                  onChange={(e) => setResolutionNotesVal(e.target.value)}
                  placeholder="Mention parts replaced, details of diagnostic checks, or extra materials purchased for this task..."
                  className="w-full rounded-xl border bg-background p-3.5 border-border/80 focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl h-10 font-bold"
                  onClick={() => setCompleteTaskId(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl h-10 font-bold bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  Submit & Finish Job
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffMaintenancePage;
