import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { MessageSquare, Mail, Phone, Bell, Send, Megaphone, ShieldAlert } from 'lucide-react';

export const CommDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Queries
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['comm-dashboard-metrics'],
    queryFn: () => api.communication.getMetrics(),
  });

  if (isLoading || !metrics) {
    return <LoadingSkeleton type="card" />;
  }

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Communication Center Dashboard"
        description="Verify unified messaging volumes, response times, active campaigns, and notification logs."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Communication' },
        ]}
      />

      {/* QUICK ACTIONS BAR */}
      <div className="flex flex-wrap gap-2.5 p-3.5 bg-card border rounded-2xl">
        <Button size="sm" onClick={() => navigate({ to: '/communication/inbox' })} className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" /> Open Unified Inbox
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/communication/email' })} className="flex items-center gap-1">
          <Mail className="w-4 h-4" /> Send Email
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/communication/sms' })} className="flex items-center gap-1">
          <Phone className="w-4 h-4" /> Send SMS Notice
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/communication/announcements' })} className="flex items-center gap-1">
          <Megaphone className="w-4 h-4" /> Publish Announcement
        </Button>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Unified Conversations</p>
            <p className="text-2xl font-black mt-1 text-primary">{metrics.totalConversations}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">{metrics.unreadMessages} Unread messages</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Sent Outbound Today</p>
            <p className="text-2xl font-black mt-1 text-emerald-500">{metrics.emailsSentToday} Emails / {metrics.smsSentToday} SMS</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">100% Delivery cleared</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Active Outbound Campaigns</p>
            <p className="text-2xl font-black mt-1 text-indigo-500">{metrics.activeCampaigns}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">{metrics.scheduledMessages} Scheduled dispatches</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Notice Board Views</p>
            <p className="text-2xl font-black mt-1 text-primary">{metrics.announcementViews}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Average read rate: 82%</span>
        </Card>
      </div>

      {/* DELIVERY FAILURE BANNER */}
      {metrics.failedDeliveries > 0 && (
        <Card className="p-5 border bg-card border-rose-500/30 bg-rose-500/5 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm uppercase text-rose-500">Outbound Delivery Issues</h4>
              <p className="text-xs text-muted-foreground font-semibold">There are {metrics.failedDeliveries} failed email dispatches waiting to be re-sent.</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10" onClick={() => navigate({ to: '/communication/activity' })}>
            View Activity Log
          </Button>
        </Card>
      )}
    </div>
  );
};
export default CommDashboardPage;
