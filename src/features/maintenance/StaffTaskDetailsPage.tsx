import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { 
  ArrowLeft, CheckCircle2, Play, AlertCircle, XCircle, Clock, 
  MapPin, User, Tag, Calendar, DollarSign, Image as ImageIcon,
  Wrench, Check
} from 'lucide-react';

export const StaffTaskDetailsPage: React.FC = () => {
  const { id } = useParams({ from: '/staff/tasks/$id' });
  const navigate = useNavigate();

  const { data: task, isLoading } = useQuery({
    queryKey: ['staff-work-order-details', id],
    queryFn: () => api.workOrders.getById(id),
  });

  const [localStatus, setLocalStatus] = useState<string>('');

  useEffect(() => {
    if (task?.status) {
      setLocalStatus(task.status);
    }
  }, [task]);

  if (isLoading) {
    return <LoadingSkeleton type="details" />;
  }

  if (!task) {
    return (
      <div className="p-8 text-center bg-card border rounded-2xl">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="font-extrabold text-sm uppercase">Task Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1">The requested maintenance task could not be retrieved.</p>
        <Button size="sm" onClick={() => navigate({ to: '/staff/dashboard' })} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  // Workflow steps definitions
  const steps = [
    { label: 'New', statusKey: 'New', desc: 'Job created' },
    { label: 'Assigned', statusKey: 'Assigned', desc: 'Tech assigned' },
    { label: 'In Progress', statusKey: 'In Progress', desc: 'Work active' },
    { label: 'Completed', statusKey: 'Completed', desc: 'Job finished' }
  ];

  // Helper to determine step status colors
  const getStepIndex = (status: string) => {
    if (status === 'New') return 0;
    if (status === 'Assigned' || status === 'Scheduled' || status === 'Waiting' || status === 'Draft') return 1;
    if (status === 'In Progress') return 2;
    if (status === 'Completed' || status === 'Closed') return 3;
    return -1;
  };

  const currentStepIndex = getStepIndex(localStatus);
  const isRejected = localStatus === 'Rejected' || localStatus === 'Cancelled';

  // UI-only action triggers
  const handleStatusChange = (status: string) => {
    setLocalStatus(status);
  };

  return (
    <div className="space-y-6 text-foreground">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate({ to: '/staff/dashboard' })}
          className="p-2 rounded-xl border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <PageHeader
          title={`Task Details - ${task.workOrderNumber}`}
          description="Detailed technician instructions, tenant details, and repair workflow."
          breadcrumbs={[
            { label: 'Portal', href: '/staff/dashboard' },
            { label: 'Tasks', href: '/staff/tasks' },
            { label: task.workOrderNumber },
          ]}
        />
      </div>

      {isRejected && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center space-x-3 text-xs font-bold animate-pulse">
          <XCircle className="w-5 h-5 shrink-0" />
          <span>This task has been {localStatus.toLowerCase()} and requires no further action.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Section - Main Task Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border bg-card space-y-6">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-mono font-black text-primary text-xs uppercase bg-primary/10 px-2.5 py-0.5 rounded">
                  {task.workOrderNumber}
                </span>
                <StatusBadge status={localStatus as any} />
              </div>
              <h2 className="text-xl font-black mt-3 leading-snug">{task.issue || 'AC Repair & Diagnostics'}</h2>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">
                {task.description || 'No detailed instructions provided. Please inspect site, diagnose root cause, and complete standard repair procedure.'}
              </p>
            </div>

            {/* Meta information details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-border/40 py-5 text-xs font-semibold">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <MapPin className="w-4.5 h-4.5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60">Location</p>
                    <p className="text-foreground mt-0.5">{task.propertyName} • Unit {task.unitNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Tag className="w-4.5 h-4.5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60">Job Priority</p>
                    <p className="text-foreground mt-0.5 flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        task.priority === 'Urgent' ? 'bg-rose-500' :
                        task.priority === 'High' ? 'bg-amber-500' :
                        task.priority === 'Medium' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`} />
                      {task.priority || 'Medium'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Calendar className="w-4.5 h-4.5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60">Scheduled Date</p>
                    <p className="text-foreground mt-0.5">{task.scheduledDate || 'TBD'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-muted-foreground">
                  <DollarSign className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60">Estimated Cost</p>
                    <p className="text-foreground mt-0.5">${task.estimatedCost || '0.00'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                onClick={() => handleStatusChange('Assigned')}
                disabled={localStatus === 'Assigned' || isRejected}
                className="flex-1 rounded-xl h-10 font-bold bg-secondary/80 hover:bg-secondary text-foreground"
              >
                Accept
              </Button>
              <Button
                onClick={() => handleStatusChange('Rejected')}
                disabled={localStatus === 'Rejected' || isRejected}
                className="flex-1 rounded-xl h-10 font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20"
              >
                Reject
              </Button>
              <Button
                onClick={() => handleStatusChange('In Progress')}
                disabled={localStatus === 'In Progress' || isRejected || localStatus === 'Completed'}
                className="flex-1 rounded-xl h-10 font-bold bg-amber-500 hover:bg-amber-600 text-white"
              >
                Start Work
              </Button>
              <Button
                onClick={() => handleStatusChange('Completed')}
                disabled={localStatus === 'Completed' || isRejected}
                className="flex-1 rounded-xl h-10 font-bold bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Complete
              </Button>
            </div>
          </Card>

          {/* Images Section */}
          <Card className="p-6 border bg-card space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider">Before & After Photos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center text-muted-foreground bg-secondary/10 hover:bg-secondary/20 transition cursor-pointer">
                <ImageIcon className="w-8 h-8 text-muted-foreground/60 mb-2" />
                <p className="text-xs font-bold">Before Repair Photo</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Tap to capture or upload</p>
              </div>

              <div className="border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center text-muted-foreground bg-secondary/10 hover:bg-secondary/20 transition cursor-pointer">
                <ImageIcon className="w-8 h-8 text-muted-foreground/60 mb-2" />
                <p className="text-xs font-bold">After Repair Photo</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Tap to capture or upload</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Section - Progress Tracker */}
        <div className="lg:col-span-1">
          <Card className="p-6 border bg-card space-y-6 sticky top-6">
            <h3 className="font-extrabold text-sm uppercase tracking-wider border-b pb-3">Workflow Progress</h3>
            
            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border/60">
              {steps.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isCompleted = idx < currentStepIndex;
                
                return (
                  <div key={step.label} className="relative flex items-start space-x-3.5 text-xs font-semibold">
                    <span className={`absolute -left-[20px] w-4.5 h-4.5 rounded-full border-4 border-card flex items-center justify-center transition-all ${
                      isActive ? 'bg-primary text-white scale-125' : 
                      isCompleted ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted && <Check className="w-2.5 h-2.5" />}
                    </span>
                    <div className="space-y-0.5">
                      <p className={`font-bold transition-all ${
                        isActive ? 'text-primary' : 
                        isCompleted ? 'text-emerald-500' : 'text-muted-foreground/80'
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 leading-relaxed font-semibold">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default StaffTaskDetailsPage;
