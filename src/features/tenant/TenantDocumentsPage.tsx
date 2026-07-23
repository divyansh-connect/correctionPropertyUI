import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Download, FileText, Plus, UploadCloud, Loader2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const TenantDocumentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Upload modal states
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileCategory, setFileCategory] = useState('Rental Agreement');
  const [customCategory, setCustomCategory] = useState('');

  // Queries
  const { data: documents = [], isLoading } = useQuery({ queryKey: ['tenant-documents-list'], queryFn: () => api.tenantDocuments.getAll() });

  const uploadMutation = useMutation({
    mutationFn: (newDoc: any) => api.tenantDocuments.upload(newDoc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-documents-list'] });
      setIsOpen(false);
      setFileName('');
      setFileCategory('Rental Agreement');
      setCustomCategory('');
    },
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileName) {
      const finalCategory = fileCategory === 'Other' ? customCategory || 'Other' : fileCategory;
      const randomSize = `${(Math.random() * 4 + 0.5).toFixed(1)} MB`;
      uploadMutation.mutate({
        name: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
        category: finalCategory,
        size: randomSize,
      });
    }
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const searchMatch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = categoryFilter === '' || doc.category === categoryFilter;
    return searchMatch && catMatch;
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'File Name',
      id: 'name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 font-bold text-foreground">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <span>{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: 'category', header: 'Category', id: 'category' },
    { accessorKey: 'uploadedAt', header: 'Uploaded Date', id: 'date' },
    { accessorKey: 'size', header: 'File Size', id: 'size' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => alert(`Downloading: ${row.original.name}`)} title="Download file">
          <Download className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="My Document Files"
        description="Verify copy of leases agreement sheets, payment invoices receipt logs, and insurance documents."
        breadcrumbs={[
          { label: 'Home', href: '/tenant' },
          { label: 'Documents' },
        ]}
        action={{
          label: 'Upload Document',
          onClick: () => setIsOpen(true),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search files by name..."
        filters={[
          {
            key: 'category',
            value: categoryFilter,
            placeholder: 'Document Category',
            options: [
              { label: 'Lease', value: 'Lease' },
              { label: 'Receipts', value: 'Receipts' },
              { label: 'Notices', value: 'Notices' },
              { label: 'Community Documents', value: 'Community Documents' },
              { label: 'Insurance', value: 'Insurance' },
              { label: 'Inspection Reports', value: 'Inspection Reports' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'category') setCategoryFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setCategoryFilter('');
        }}
      />

      <DataTable columns={columns} data={filteredDocs} loading={isLoading} />

      {/* UPLOAD DIALOG */}
      <FormDialog open={isOpen} onOpenChange={setIsOpen} title="Upload New Document">
        <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2 text-xs font-semibold text-foreground">
          <div 
            onClick={handleDropzoneClick}
            className="border-2 border-dashed border-border rounded-2xl p-6 text-center space-y-2 hover:border-primary/50 transition cursor-pointer"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="font-bold">Drag and drop file here or click to browse</p>
            <p className="text-[10px] text-muted-foreground">PDF, PNG, JPG up to 5MB</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Document Title</label>
            <Input required placeholder="E.g., Renter Insurance Policy" value={fileName} onChange={e => setFileName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Category</label>
            <Select value={fileCategory} onChange={e => setFileCategory(e.target.value)}>
              <option value="Rental Agreement">Rental Agreement</option>
              <option value="Identity Proof">Identity Proof (Govt ID)</option>
              <option value="Income Proof">Proof of Income</option>
              <option value="Utility Bills">Utility Bills</option>
              <option value="Insurance">Renter's Insurance</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          {fileCategory === 'Other' && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Custom Category Name</label>
              <Input required placeholder="E.g., Bank Statement" value={customCategory} onChange={e => setCustomCategory(e.target.value)} />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={uploadMutation.isPending}>
              {uploadMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Upload File
            </Button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
};
export default TenantDocumentsPage;
