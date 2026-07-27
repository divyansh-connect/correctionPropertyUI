import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { useNotificationStore, useAuthStore } from '../../store/useStore';
import { useNavigate } from '@tanstack/react-router';
import { getNotificationRedirectPath } from '../../utils/navigation';
import { Check, Trash2, Bell } from 'lucide-react';

export const TenantNotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const roleNotifications = notifications.filter((n) => n.role === 'Tenant');

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('tenant.notifications.title')}
        description={t('tenant.notifications.desc')}
        breadcrumbs={[
          { label: t('header.home'), href: '/tenant' },
          { label: t('tenant.notifications.title') }
        ]}
        action={{
          label: t('tenant.notifications.markAllRead'),
          onClick: () => markAllAsRead('Tenant'),
          icon: <Check className="w-4 h-4" />
        }}
      />

      <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase border-b pb-2">
        <span>{t('tenant.notifications.recentActivity', { count: roleNotifications.length })}</span>
        {roleNotifications.length > 0 && (
          <button onClick={() => clearAll('Tenant')} className="text-rose-500 hover:underline flex items-center gap-1">
            <Trash2 className="w-3.5 h-3.5" /> {t('tenant.notifications.clearAll')}
          </button>
        )}
      </div>

      {roleNotifications.length === 0 ? (
        <div className="bg-card border rounded-2xl p-12 text-center space-y-3">
          <Bell className="w-8 h-8 text-muted-foreground mx-auto opacity-60" />
          <h4 className="font-bold text-xs">{t('tenant.notifications.noAlerts')}</h4>
          <p className="text-[10px] text-muted-foreground">{t('tenant.notifications.allCaughtUp')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {roleNotifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => {
                markAsRead(n.id);
                const path = getNotificationRedirectPath(n.title, n.message, user?.role || 'Tenant', n.targetId);
                if (path) {
                  navigate({ to: path });
                }
              }}
              className={`p-4 rounded-xl border bg-card flex justify-between items-start transition cursor-pointer hover:bg-secondary/20 hover:border-primary/40 ${
                !n.read ? 'border-l-4 border-l-primary' : 'opacity-85'
              }`}
            >
              <div className="space-y-1 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-foreground">{n.title}</span>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
                <p className="text-muted-foreground text-[11px] font-medium leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-muted-foreground/60">{n.time}</p>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status={n.type} />
                {!n.read && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => markAsRead(n.id)}
                    className="text-[10px] font-extrabold px-2 py-1 text-primary"
                  >
                    {t('tenant.notifications.markRead')}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantNotificationsPage;
