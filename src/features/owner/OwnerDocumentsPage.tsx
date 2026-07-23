import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { OwnerDocument } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Download, FileText, Plus, UploadCloud, Loader2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const OwnerDocumentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Upload modal states
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileCategory, setFileCategory] = useState('Statements');
  const [customCategory, setCustomCategory] = useState('');

  // Queries
  const { data: documents = [], isLoading } = useQuery({ queryKey: ['owner-documents-list'], queryFn: () => api.ownerDocuments.getAll() });

  const uploadMutation = useMutation({
    mutationFn: (newDoc: any) => api.ownerDocuments.upload(newDoc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-documents-list'] });
      setIsOpen(false);
      setFileName('');
      setFileCategory('Statements');
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

  const columns: ColumnDef<OwnerDocument>[] = [
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
        title="Portfolio Documents Log"
        description="Verify monthly statements sheets, signed contracts, insurance policies, and annual tax returns."
        breadcrumbs={[
          { label: 'Home', href: '/owner' },
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
        searchPlaceholder="Search document name..."
        filters={[
          {
            key: 'category',
            value: categoryFilter,
            placeholder: 'Document Category',
            options: [
              { label: 'Statements', value: 'Statements' },
              { label: 'Tax Documents', value: 'Tax Documents' },
              { label: 'Contracts', value: 'Contracts' },
              { label: 'Insurance', value: 'Insurance' },
              { label: 'Property Photos', value: 'Property Photos' },
              { label: 'Maintenance Reports', value: 'Maintenance Reports' },
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

      <DataTable columns={columns} data={filteredDocs.slice(0, 100)} loading={isLoading} />

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
            <Input required placeholder="E.g., Year End Tax Statement" value={fileName} onChange={e => setFileName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Category</label>
            <Select value={fileCategory} onChange={e => setFileCategory(e.target.value)}>
              <option value="Statements">Statements</option>
              <option value="Tax Documents">Tax Documents</option>
              <option value="Contracts">Contracts</option>
              <option value="Insurance">Insurance</option>
              <option value="Property Photos">Property Photos</option>
              <option value="Maintenance Reports">Maintenance Reports</option>
              <option value="Inspection Reports">Inspection Reports</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          {fileCategory === 'Other' && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Custom Category Name</label>
              <Input required placeholder="E.g., Bank Payout Slip" value={customCategory} onChange={e => setCustomCategory(e.target.value)} />
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
export default OwnerDocumentsPage;
