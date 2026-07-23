import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { FilterBar } from '../../components/FilterBar';
import { DocumentCard } from '../../components/DocumentComponents';
import { DataTable } from '../../components/DataTable';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { LayoutGrid, List, Upload } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { StatusBadge } from '../../components/StatusBadge';
import { FileTypeIcon } from '../../components/DocumentComponents';
import { useNavigate } from '@tanstack/react-router';

export const DocsAllPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'owner' | 'tenant'>('all');

  const { data: docs = [], isLoading } = useQuery({ queryKey: ['docs-all'], queryFn: () => api.documents.getAll() });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => api.documents.archive(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['docs-all'] }),
  });

  const filtered = docs.filter((d) => {
    const nameMatch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = categoryFilter === '' || d.category === categoryFilter;
    
    let roleMatch = true;
    if (roleFilter === 'owner') {
      const ownerCats = ['Statement', 'Tax', 'Insurance', 'Contract', 'Financial', 'Inspection'];
      roleMatch = ownerCats.includes(d.category) || d.name.toLowerCase().includes('owner') || d.name.toLowerCase().includes('statement') || d.name.toLowerCase().includes('tax');
    } else if (roleFilter === 'tenant') {
      const tenantCats = ['Lease', 'Invoice', 'Receipt', 'Identification', 'Maintenance', 'Legal'];
      roleMatch = tenantCats.includes(d.category) || d.name.toLowerCase().includes('tenant') || d.name.toLowerCase().includes('lease') || d.name.toLowerCase().includes('invoice') || d.name.toLowerCase().includes('receipt');
    }

    return nameMatch && catMatch && roleMatch;
  });

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'name', header: 'Document Name', id: 'name', cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileTypeIcon name={row.original.name} />
        <span className="font-bold text-sm">{row.original.name}</span>
      </div>
    )},
    { accessorKey: 'category', header: 'Category', id: 'category', cell: ({ row }) => <span className="text-[9px] font-black uppercase bg-secondary border px-2 py-0.5 rounded">{row.original.category}</span> },
    { accessorKey: 'folderName', header: 'Folder', id: 'folder' },
    { accessorKey: 'owner', header: 'Owner', id: 'owner' },
    { accessorKey: 'property', header: 'Property', id: 'property' },
    { accessorKey: 'size', header: 'Size', id: 'size' },
    { accessorKey: 'version', header: 'Version', id: 'version', cell: ({ row }) => <span className="font-bold">v{row.original.version}</span> },
    { accessorKey: 'status', header: 'Status', id: 'status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'updatedAt', header: 'Updated', id: 'updated' },
    { id: 'actions', header: 'Actions', cell: ({ row }) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" className="text-[9px]" onClick={() => alert(`Downloading ${row.original.name}`)}>Download</Button>
        <Button variant="ghost" size="sm" className="text-[9px] text-rose-500" onClick={() => archiveMutation.mutate(row.original.id)}>Archive</Button>
      </div>
    )},
  ];

  if (isLoading) return <LoadingSkeleton type="table" />;

  return (
    <div>
      <PageHeader
        title="All Documents Library"
        description="Browse, search, filter, and manage all uploaded files across properties, tenants, and leases."
        breadcrumbs={[{ label: 'Documents', href: '/documents' }, { label: 'All Documents' }]}
        action={{ label: 'Upload Document', onClick: () => navigate({ to: '/documents/upload' }), icon: <Upload className="w-4 h-4" /> }}
      />

      {/* Role Filters */}
      <div className="flex gap-2 p-1 bg-secondary/15 border rounded-2xl w-fit mb-4">
        <button
          onClick={() => setRoleFilter('all')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            roleFilter === 'all' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-secondary text-muted-foreground'
          }`}
        >
          All Documents
        </button>
        <button
          onClick={() => setRoleFilter('owner')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            roleFilter === 'owner' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-secondary text-muted-foreground'
          }`}
        >
          Owner Documents
        </button>
        <button
          onClick={() => setRoleFilter('tenant')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            roleFilter === 'tenant' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-secondary text-muted-foreground'
          }`}
        >
          Tenant Documents
        </button>
      </div>

      <div className="flex items-start gap-2 flex-wrap">
        <div className="flex-1">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search documents by name..."
            filters={[{
              key: 'category', value: categoryFilter, placeholder: 'Category',
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
    </div>
  );
};
export default DocsAllPage;
