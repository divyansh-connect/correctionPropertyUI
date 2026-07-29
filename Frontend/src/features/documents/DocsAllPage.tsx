import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { FilterBar } from '../../components/FilterBar';
import { DocumentCard } from '../../components/DocumentComponents';
import { DataTable } from '../../components/DataTable';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { LayoutGrid, List, Upload, ChevronRight } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { StatusBadge } from '../../components/StatusBadge';
import { FileTypeIcon } from '../../components/DocumentComponents';
import { useNavigate } from '@tanstack/react-router';
import { UploadDocumentModal } from './UploadDocumentModal';

export const DocsAllPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Dropdown & Modal states
  const [uploadDropdownOpen, setUploadDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'owner' | 'tenant'>('owner');

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'owner' | 'tenant'>('all');

  // Queries for real DB data
  const { data: generalDocs = [], isLoading: loadingGeneral } = useQuery({
    queryKey: ['docs-general'],
    queryFn: () => api.documents.getAll()
  });

  const { data: ownerDocs = [], isLoading: loadingOwner } = useQuery({
    queryKey: ['docs-owner'],
    queryFn: () => api.documents.getOwnerDocs()
  });

  const { data: tenantDocs = [], isLoading: loadingTenant } = useQuery({
    queryKey: ['docs-tenant'],
    queryFn: () => api.documents.getTenantDocs()
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll()
  });

  const { data: owners = [] } = useQuery({
    queryKey: ['owners'],
    queryFn: () => api.owner.getAll()
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => api.tenant.getAll()
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => api.documents.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['docs-general'] });
      queryClient.invalidateQueries({ queryKey: ['docs-owner'] });
      queryClient.invalidateQueries({ queryKey: ['docs-tenant'] });
    },
  });

  const isLoading = loadingGeneral || loadingOwner || loadingTenant;

  const normalizeCategory = (cat: string) => {
    if (!cat) return 'Other';
    const c = cat.toLowerCase().trim();
    if (c === 'statements' || c === 'statement') return 'Statement';
    if (c === 'tax documents' || c === 'tax') return 'Tax';
    if (c === 'contracts' || c === 'contract') return 'Contract';
    if (c === 'receipts' || c === 'receipt') return 'Receipt';
    if (c === 'invoices' || c === 'invoice') return 'Invoice';
    if (c === 'leases' || c === 'lease') return 'Lease';
    if (c === 'inspections' || c === 'inspection' || c === 'inspection reports') return 'Inspection';
    if (c === 'maintenance' || c === 'maintenance records' || c === 'maintenance reports') return 'Maintenance';
    if (c === 'insurance' || c === 'insurance policies') return 'Insurance';
    if (c === 'legal' || c === 'legal documents') return 'Legal';
    
    // Capitalize first letter
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  // Map owner documents
  const mappedOwnerDocs = ownerDocs.map((d: any) => {
    const prop = properties.find((p: any) => p.id === d.propertyId);
    const own = owners.find((o: any) => o.id === d.ownerId);
    return {
      id: d.id,
      name: d.name,
      category: normalizeCategory(d.category || 'Statement'),
      folderName: 'Owners',
      owner: own ? `${own.firstName} ${own.lastName}` : 'N/A',
      property: prop ? prop.name : 'N/A',
      size: d.size || '1.2 MB',
      version: 1,
      status: 'Active',
      updatedAt: d.uploadedAt ? d.uploadedAt.split('T')[0] : 'N/A',
      role: 'owner',
    };
  });

  // Map tenant documents
  const mappedTenantDocs = tenantDocs.map((d: any) => {
    const prop = properties.find((p: any) => p.id === d.propertyId);
    const ten = tenants.find((t: any) => t.id === d.tenantId);
    return {
      id: d.id,
      name: d.name,
      category: normalizeCategory(d.category || 'Lease'),
      folderName: 'Tenants',
      owner: ten ? `${ten.firstName} ${ten.lastName}` : 'N/A',
      property: prop ? prop.name : 'N/A',
      size: d.size || '1.5 MB',
      version: 1,
      status: 'Active',
      updatedAt: d.uploadedAt ? d.uploadedAt.split('T')[0] : 'N/A',
      role: 'tenant',
    };
  });

  // Map general documents
  const mappedGeneralDocs = generalDocs.map((d: any) => ({
    ...d,
    category: normalizeCategory(d.category || 'Other'),
    role: 'general',
  }));

  // Combine and filter
  const allDocs = [...mappedGeneralDocs, ...mappedOwnerDocs, ...mappedTenantDocs];

  const filtered = allDocs.filter((d) => {
    const nameMatch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = categoryFilter === '' || d.category === categoryFilter;
    
    let roleMatch = true;
    if (roleFilter === 'owner') {
      roleMatch = d.role === 'owner';
    } else if (roleFilter === 'tenant') {
      roleMatch = d.role === 'tenant';
    }

    return nameMatch && catMatch && roleMatch;
  });

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'name', header: t('pmDocuments.docName'), id: 'name', cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileTypeIcon name={row.original.name} />
        <span className="font-bold text-sm">{row.original.name}</span>
      </div>
    )},
    { accessorKey: 'category', header: t('pmDocuments.category'), id: 'category', cell: ({ row }) => <span className="text-[9px] font-black uppercase bg-secondary border px-2 py-0.5 rounded">{row.original.category}</span> },
    { accessorKey: 'folderName', header: t('pmDocuments.folder'), id: 'folder' },
    { accessorKey: 'owner', header: t('pmDocuments.owner'), id: 'owner' },
    { accessorKey: 'property', header: t('pmDocuments.property'), id: 'property' },
    { accessorKey: 'size', header: t('pmDocuments.size'), id: 'size' },
    { accessorKey: 'version', header: t('pmDocuments.version'), id: 'version', cell: ({ row }) => <span className="font-bold">v{row.original.version}</span> },
    { accessorKey: 'status', header: t('pmDocuments.status'), id: 'status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'updatedAt', header: t('pmDocuments.updated'), id: 'updated' },
    { id: 'actions', header: t('pmDocuments.actions'), cell: ({ row }) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" className="text-[9px]" onClick={() => alert(`Downloading ${row.original.name}`)}>Download</Button>
        <Button variant="ghost" size="sm" className="text-[9px] text-rose-500" onClick={() => archiveMutation.mutate(row.original.id)}>Archive</Button>
      </div>
    )},
  ];

  if (isLoading) return <LoadingSkeleton type="table" />;

  return (
    <div>
      {/* Premium Header Layout */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 pb-6 border-b border-border/60 mb-6">
        <div className="space-y-1.5">
          <nav className="flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground mb-1">
            <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate({ to: '/' })}>
              {t('header.home')}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate({ to: '/documents' })}>
              {t('nav.documents')}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="text-foreground/80 font-bold">{t('pmDocuments.allTitle')}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            {t('pmDocuments.allTitle')}
          </h1>
          <p className="text-sm text-muted-foreground font-medium max-w-2xl leading-relaxed">
            {t('pmDocuments.allDesc')}
          </p>
        </div>

        {/* Dropdown Action Button */}
        <div className="relative pt-2 md:pt-0">
          <Button
            onClick={() => setUploadDropdownOpen(!uploadDropdownOpen)}
            className="shadow-sm font-semibold flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            {t('pmDocuments.uploadDocument')}
            <span className="text-[8px] ml-0.5">▼</span>
          </Button>

          {uploadDropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setUploadDropdownOpen(false)}
              />
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1 z-40 animate-in fade-in slide-in-from-top-2 duration-150 text-foreground">
                <button
                  onClick={() => {
                    setUploadDropdownOpen(false);
                    setModalType('owner');
                    setIsModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-foreground hover:bg-secondary/40 transition-colors flex items-center gap-2"
                >
                  📂 Upload for Owner
                </button>
                <button
                  onClick={() => {
                    setUploadDropdownOpen(false);
                    setModalType('tenant');
                    setIsModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-foreground hover:bg-secondary/40 transition-colors flex items-center gap-2"
                >
                  👤 Upload for Tenant
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Role Filters */}
      <div className="flex gap-2 p-1 bg-secondary/15 border rounded-2xl w-fit mb-4">
        <button
          onClick={() => setRoleFilter('all')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            roleFilter === 'all' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-secondary text-muted-foreground'
          }`}
        >
          {t('pmDocuments.allDocsTab')}
        </button>
        <button
          onClick={() => setRoleFilter('owner')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            roleFilter === 'owner' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-secondary text-muted-foreground'
          }`}
        >
          {t('pmDocuments.ownerDocsTab')}
        </button>
        <button
          onClick={() => setRoleFilter('tenant')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            roleFilter === 'tenant' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-secondary text-muted-foreground'
          }`}
        >
          {t('pmDocuments.tenantDocsTab')}
        </button>
      </div>

      <div className="flex items-start gap-2 flex-wrap">
        <div className="flex-1">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={t('pmDocuments.searchDocs')}
            filters={[{
              key: 'category', value: categoryFilter, placeholder: t('pmDocuments.category'),
              options: ['Lease','Invoice','Receipt','Statement','Inspection','Maintenance','Tax','Insurance','Contract','Legal','Other'].map(c => ({ label: c, value: c })),
            }]}
            onFilterChange={(k, v) => { if (k === 'category') setCategoryFilter(v); }}
            onReset={() => { setSearchQuery(''); setCategoryFilter(''); }}
          />
        </div>
        <div className="flex gap-1 border rounded-lg overflow-hidden shrink-0">
          <button onClick={() => setViewMode('table')} className={`p-2 ${viewMode === 'table' ? 'bg-primary text-white' : 'hover:bg-secondary'}`}><List className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-secondary'}`}><LayoutGrid className="w-4 h-4" /></button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <DataTable columns={columns} data={filtered} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {filtered.slice(0, 40).map((doc) => (
            <DocumentCard
              key={doc.id} id={doc.id} name={doc.name} category={doc.category}
              size={doc.size} status={doc.status} updatedAt={doc.updatedAt} owner={doc.owner}
              onDownload={() => alert(`Downloading ${doc.name}`)}
              onPreview={() => alert(`Previewing ${doc.name}`)}
              onArchive={() => archiveMutation.mutate(doc.id)}
            />
          ))}
        </div>
      )}

      {/* Floating Dialog Modal */}
      <UploadDocumentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        type={modalType}
      />
    </div>
  );
};
export default DocsAllPage;
