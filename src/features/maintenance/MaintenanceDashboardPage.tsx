import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { useAuthStore } from '../../store/useStore';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { StatusBadge } from '../../components/StatusBadge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Plus, CheckSquare, Settings, AlertCircle, Wrench, ShieldAlert, ArrowRight,
  Clipboard, Clock, CheckCircle2, XCircle, Search, Eye, Play, Check
} from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

export const MaintenanceDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isStaff = user?.role === 'Maintenance Staff';

  // --- QUERY FOR PROPERTY MANAGER VIEW ---
  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['maintenance-metrics'],
    queryFn: () => api.maintenance.getMetrics(),
    enabled: !isStaff,
  });

  const { data: recentRequests = [], isLoading: loadingRecent } = useQuery({
    queryKey: ['recent-maintenance-requests'],
    queryFn: async () => {
      const all = await api.serviceRequests.getAll();
      return all.slice(0, 5);
    },
    enabled: !isStaff,
  });

  // --- QUERY FOR MAINTENANCE STAFF VIEW ---
  const { data: allWorkOrders = [], isLoading: loadingWorkOrders } = useQuery({
    queryKey: ['staff-dashboard-work-orders'],
    queryFn: () => api.workOrders.getAll(),
    enabled: isStaff,
  });

  // Filter orders assigned to this technician
  const myWorkOrders = allWorkOrders.filter(
    (w: any) => w.assignedTechnician === user?.name
  );

  // Local interactive state for staff work orders (UI-only status updates)
  const [localWorkOrders, setLocalWorkOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (myWorkOrders.length && !localWorkOrders.length) {
      setLocalWorkOrders(myWorkOrders);
    }
  }, [myWorkOrders, localWorkOrders]);

  const updateLocalStatus = (orderId: string, newStatus: string) => {
    setLocalWorkOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );
  };

  // Staff Search filtering
  const filteredWorkOrders = localWorkOrders.filter((order: any) => {
    const matchesSearch = 
      order.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.issue && order.issue.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Staff summary counts
  const assignedCount = localWorkOrders.filter(w => w.status === 'New' || w.status === 'Assigned').length;
  const inProgressCount = localWorkOrders.filter(w => w.status === 'In Progress').length;
  const completedCount = localWorkOrders.filter(w => w.status === 'Completed' || w.status === 'Closed').length;
  const rejectedCount = localWorkOrders.filter(w => w.status === 'Rejected' || w.status === 'Cancelled').length;

  if (isStaff) {
    if (loadingWorkOrders) {
      return <LoadingSkeleton type="card" />;
    }

    return (
      <div className="space-y-6 text-foreground">
        <PageHeader
          title="Maintenance Staff Portal"
          description="View your workload summary, accept assignments, and update task progress."
          breadcrumbs={[
            { label: 'Portal', href: '/staff/dashboard' },
            { label: 'Dashboard' },
          ]}
        />

        {/* STAFF SUMMARY METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border bg-gradient-to-br from-blue-500/5 to-blue-500/10 flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-500 shadow-inner">
              <Clipboard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Assigned Tasks</p>
              <p className="text-2xl font-black mt-0.5 text-blue-500">{assignedCount}</p>
            </div>
          </Card>

          <Card className="p-5 border bg-gradient-to-br from-amber-500/5 to-amber-500/10 flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500 shadow-inner">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-black mt-0.5 text-amber-500">{inProgressCount}</p>
            </div>
          </Card>

          <Card className="p-5 border bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-black mt-0.5 text-emerald-500">{completedCount}</p>
            </div>
          </Card>

          <Card className="p-5 border bg-gradient-to-br from-rose-500/5 to-rose-500/10 flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500 shadow-inner">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Rejected</p>
              <p className="text-2xl font-black mt-0.5 text-rose-500">{rejectedCount}</p>
            </div>
          </Card>
        </div>

        {/* MY TASKS CONTROL BAR */}
        <div className="flex gap-3.5 p-4 bg-card border rounded-2xl shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, Property, Unit or Issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        </div>

        {/* WORK ORDER LIST/CARDS */}
        <Card className="p-5 border bg-card space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider">My Tasks</h3>
          
          {filteredWorkOrders.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted-foreground font-semibold">
              No assigned tasks found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredWorkOrders.map((order: any) => (
                <div 
                  key={order.id} 
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-2xl border bg-secondary/10 hover:border-primary/30 transition-all group animate-in fade-in duration-200"
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
                    
                    <h4 className="font-bold text-sm text-foreground">{order.issue || 'AC Diagnostics and Fix'}</h4>
                    <p className="text-[11px] text-muted-foreground font-semibold">{order.propertyName} • Unit {order.unitNumber}</p>
                  </div>

                  <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2 w-full md:w-auto border-t pt-3 md:pt-0 md:border-0 justify-between">
                    <div className="flex gap-2">
                      {/* UI-only action triggers based on state */}
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
  }

  // --- RENDER ORIGINAL PROPERTY MANAGER DASHBOARD ---
  if (loadingMetrics || loadingRecent || !metrics) {
    return <LoadingSkeleton type="card" />;
  }

  const priorityData = [
    { name: 'Urgent', value: metrics.emergencyRequests },
    { name: 'High', value: 8 },
    { name: 'Medium', value: 15 },
    { name: 'Low', value: 20 },
  ];

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Maintenance Dashboard"
        description="Verify service ticket progress, contractor assignments, operating maintenance costs, and inspections."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Maintenance' },
        ]}
      />

      {/* QUICK ACTIONS */}
      <div className="flex flex-wrap gap-2.5 p-3.5 bg-card border rounded-2xl">
        <Button size="sm" onClick={() => navigate({ to: '/maintenance/requests/new' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Create Request
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/maintenance/work-orders' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Create Work Order
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/inspections/new' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Schedule Inspection
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/vendors' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Vendor
        </Button>
      </div>

      {/* STATS METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Open Requests</p>
            <p className="text-2xl font-black mt-1 text-primary">{metrics.openRequests}</p>
          </div>
          <span className="text-[10px] text-rose-500 font-bold mt-4 flex items-center gap-0.5 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" /> {metrics.emergencyRequests} Emergency
          </span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Work Orders In Progress</p>
            <p className="text-2xl font-black mt-1 text-amber-500">{metrics.workOrdersInProgress}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Assigned to active technicians</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Completed This Month</p>
            <p className="text-2xl font-black mt-1 text-emerald-500">{metrics.completedThisMonth}</p>
          </div>
          <span className="text-[10px] text-emerald-500 font-bold mt-4">
            Avg completion: {metrics.avgCompletionTime}
          </span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Maintenance Cost</p>
            <p className="text-2xl font-black mt-1 text-rose-500">${metrics.totalMaintenanceCost.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Work orders and materials</span>
        </Card>
      </div>

      {/* GRAPH & METRIC DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests by Priority */}
        <Card className="lg:col-span-1 p-6 border bg-card flex flex-col justify-between">
          <h3 className="font-extrabold text-sm uppercase mb-4 tracking-wider">Requests Priority Bracket</h3>
          <div className="h-60 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-muted-foreground pt-4 border-t border-border/40">
            {priorityData.map((pr, index) => (
              <div key={pr.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{pr.name} ({pr.value})</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Service Requests list */}
        <Card className="lg:col-span-2 p-5 border bg-card space-y-4">
          <h3 className="font-extrabold text-sm uppercase border-b pb-3 tracking-wider">Recent Service Tickets</h3>
          <div className="divide-y space-y-3">
            {recentRequests.map((req) => (
              <div key={req.id} className="pt-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold">{req.title}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">Unit {req.unitNumber} • {req.propertyName}</p>
                </div>
                <div className="text-right flex items-center space-x-3">
                  <span className="text-[9px] font-bold text-muted-foreground">{req.createdAt}</span>
                  <Button variant="ghost" size="sm" onClick={() => navigate({ to: `/maintenance/requests/${req.id}` })} className="h-7 text-[10px] text-primary hover:bg-primary/10">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceDashboardPage;
