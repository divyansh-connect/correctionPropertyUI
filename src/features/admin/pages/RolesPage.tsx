import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { PermissionMatrix } from '../components/PermissionMatrix';
import { ShieldCheck, Trash2, Settings } from 'lucide-react';

export const RolesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // (No modal states needed)

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch Roles
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['rbac-roles-list'],
    queryFn: () => api.roles.getAll(),
  });

  // Active Selected Role
  const activeRole = roles.find((r: any) => r.id === (selectedRoleId || roles[0]?.id));

  // Mutations
  const createRoleMutation = useMutation({
    mutationFn: async (payload: any) => {
      // Initialize with default empty/minimal permissions structure
      const modules = [
        'dashboard', 'properties', 'leases', 'tenants', 'owners', 
        'payments', 'accounting', 'maintenance', 'documents', 
        'reports', 'communication', 'settings'
      ];
      const permissions = modules.map(m => ({
        module: m,
        view: false,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        export: false
      }));
      return api.roles.create({
        name: payload.name,
        description: payload.description,
        permissions,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rbac-roles-list'] });
      setSelectedRoleId(data.id);
      setIsCreateOpen(false);
      setNewRoleName('');
      setNewRoleDesc('');
      triggerNotification(`Custom role "${data.name}" created successfully!`);
    },
  });

  const cloneRoleMutation = useMutation({
    mutationFn: (payload: { id: string; name: string }) => 
      api.roles.clone(payload.id, payload.name),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rbac-roles-list'] });
      setSelectedRoleId(data.id);
      setIsCloneOpen(false);
      setCloneName('');
      triggerNotification(`Role cloned successfully as "${data.name}"!`);
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) => api.roles.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rbac-roles-list'] });
      setSelectedRoleId(null);
      triggerNotification('Custom role deleted successfully.', 'info');
    },
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: (payload: { id: string; permissions: any[] }) => 
      api.roles.update(payload.id, { permissions: payload.permissions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rbac-roles-list'] });
      triggerNotification('Role permissions synchronized successfully!');
    },
  });

  const handlePermissionToggle = (
    module: string,
    action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export',
    checked: boolean
  ) => {
    if (!activeRole) return;

    const updatedPermissions = activeRole.permissions.map((p: any) => {
      if (p.module === module) {
        return { ...p, [action]: checked };
      }
      return p;
    });

    updatePermissionsMutation.mutate({
      id: activeRole.id,
      permissions: updatedPermissions,
    });
  };

  return (
    <div className="space-y-6 text-foreground relative">
      <PageHeader
        title="Access Roles & Permissions"
        description="Establish organizational authorization levels, custom roles, and configure dynamic module matrices."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Administration' }, { label: 'Roles & Permissions' }]}
      />

      {notification && (
        <div className="p-4 rounded-xl text-xs font-bold border bg-emerald-500/10 border-emerald-500/20 text-emerald-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ROLES SELECTOR LIST */}
        <div className="space-y-4">
          <div className="bg-card border border-border p-4 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-2 border-border">
              <h4 className="font-extrabold text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                <Settings className="w-4 h-4" /> Available Roles
              </h4>
            </div>

            {isLoading ? (
              <div className="py-6 text-center text-xs text-muted-foreground">Loading system roles...</div>
            ) : (
              <div className="space-y-2">
                {roles.map((r: any) => {
                  const isSelected = activeRole?.id === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRoleId(r.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:bg-secondary/20 text-foreground'
                        }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-xs">{r.name}</span>
                        {r.isCustom && (
                          <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-500 rounded text-[9px] font-extrabold uppercase">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 font-medium">
                        {r.description || 'No description provided.'}
                      </p>

                      {/* ROLE MANAGEMENT QUICK ACTIONS */}
                      {isSelected && r.isCustom && (
                        <div className="flex gap-2 mt-3 pt-2 border-t border-border/50 justify-end" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => deleteRoleMutation.mutate(r.id)}
                            className="p-1 hover:bg-rose-500/10 rounded text-rose-500 hover:text-rose-600 text-[10px] font-bold flex items-center gap-0.5"
                            title="Delete Custom Role"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ROLE PERMISSION MATRIX */}
        <div className="lg:col-span-2">
          {activeRole ? (
            <PermissionMatrix role={activeRole} onToggle={handlePermissionToggle} />
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground shadow-sm py-12">
              <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-xs font-semibold mt-2">Select a role profile from the list to view its module accessibility.</p>
            </div>
          )}
        </div>

      </div>


    </div>
  );
};

export default RolesPage;
