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
  Clock, Search, Eye, Play, Check, AlertCircle, XCircle
} from 'lucide-react';

export const StaffMaintenancePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we are on the Completed Tasks view
  const isCompletedView = location.pathname.includes('/completed');

  const [searchQuery, setSearchQuery] = useState('');
  const [localWorkOrders, setLocalWorkOrders] = useState<any[]>([]);

  // Fetch all work orders
  const { data: allWorkOrders = [], isLoading } = useQuery({
    queryKey: ['staff-work-orders'],
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

  // Quick Action transitions (UI only)
  const updateLocalStatus = (orderId: string, newStatus: string) => {
    setLocalWorkOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );
  };

  if (isLoading) {
    return <LoadingSkeleton type="card" />;
  }

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title={isCompletedView ? "Completed Tasks" : "My Active Tasks"}
        description={
          isCompletedView 
            ? "View your completed, closed, or rejected maintenance history." 
            : "Manage, execute, and update your active assigned jobs."
        }
        breadcrumbs={[
          { label: 'Portal', href: '/staff/dashboard' },
          { label: isCompletedView ? 'Completed Tasks' : 'Active Tasks' },
        ]}
      />

      {/* SEARCH CONTROL BAR */}
      <div className="flex gap-3.5 p-4 bg-card border rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by ID, Property, Unit or Issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>

      {/* TASK LIST CARDS */}
      <Card className="p-5 border bg-card space-y-4">
        <h3 className="font-extrabold text-sm uppercase tracking-wider">
          {isCompletedView ? "Completed Archives" : "Assigned Task List"}
        </h3>
        
        {filteredWorkOrders.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground font-semibold">
            No tasks found matching your current dashboard view.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredWorkOrders.map((order: any) => (
              <div 
                key={order.id} 
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-2xl border bg-secondary/10 hover:border-primary/30 transition-all group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-primary text-xs uppercase bg-primary/10 px-2 py-0.5 rounded">
                      {order.workOrderNumber}
                    </span>
                    <StatusBadge status={order.status} />
                    {order.priority && (
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                        order.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                        order.priority === 'High' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        order.priority === 'Medium' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}>
                        {order.priority}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-bold text-sm text-foreground">{order.issue || 'AC Repair & Inspection'}</h4>
                  <p className="text-[11px] text-muted-foreground font-semibold">{order.propertyName} • Unit {order.unitNumber}</p>
                  
                  <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-wider pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      Sch. Date: <strong className="text-foreground">{order.scheduledDate || 'TBD'}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      Est. Cost: <strong className="text-foreground">${order.estimatedCost}</strong>
                    </span>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2 w-full md:w-auto border-t pt-3 md:pt-0 md:border-0 justify-between">
                  <div className="flex gap-2">
                    {/* UI-only dynamic action buttons based on task state */}
                    {(order.status === 'New' || order.status === 'Assigned') && (
                      <>
                        <button
                          onClick={() => updateLocalStatus(order.id, 'Assigned')}
                          className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateLocalStatus(order.id, 'Rejected')}
                          className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-all"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {['Assigned', 'Scheduled', 'Draft'].includes(order.status) && (
                      <button
                        onClick={() => updateLocalStatus(order.id, 'In Progress')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-extrabold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/20 transition-all"
                      >
                        <Play className="w-3 h-3 fill-amber-500" /> Start Work
                      </button>
                    )}

                    {order.status === 'In Progress' && (
                      <button
                        onClick={() => updateLocalStatus(order.id, 'Completed')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-extrabold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/20 transition-all"
                      >
                        <Check className="w-3 h-3" /> Complete
                      </button>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => navigate({ to: `/staff/tasks/${order.id}` })}
                    className="flex items-center gap-1.5 bg-secondary/80 hover:bg-secondary text-foreground h-9 font-bold px-4 rounded-xl border"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StaffMaintenancePage;
