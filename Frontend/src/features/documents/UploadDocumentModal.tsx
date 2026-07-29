import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../api';

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'owner' | 'tenant';
  onSuccess?: () => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  open,
  onOpenChange,
  type,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // Form fields
  const [propertyId, setPropertyId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [category, setCategory] = useState(type === 'owner' ? 'Statements' : 'Leasing');
  const [docName, setDocName] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Categories lists
  const ownerCategories = ['Statements', 'Tax Documents', 'Contracts', 'Insurance', 'Property Photos', 'Maintenance Reports', 'Inspection Reports', 'Other'];
  const tenantCategories = ['Lease', 'Receipts', 'Notices', 'Community Documents', 'Insurance', 'Inspection Reports', 'Other'];

  // Queries
  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
    enabled: open,
  });

  const { data: buildings = [] } = useQuery({
    queryKey: ['buildings'],
    queryFn: () => api.building.getAll(),
    enabled: open && type === 'tenant',
  });

  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: () => api.unit.getAll(),
    enabled: open && type === 'tenant',
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => api.tenant.getAll(),
    enabled: open && type === 'tenant',
  });

  // Reset form when dialog opens/closes or type changes
  useEffect(() => {
    if (open) {
      setFile(null);
      setPropertyId('');
      setBuildingId('');
      setUnitId('');
      setTenantId('');
      setOwnerId('');
      setCategory(type === 'owner' ? 'Statements' : 'Leasing');
      setDocName('');
      setErrorMsg('');
      setSuccess(false);
    }
  }, [open, type]);

  // Derived filter logic for Tenant upload flow
  const filteredBuildings = buildings.filter((b: any) => b.propertyId === propertyId);
  const filteredUnits = units.filter((u: any) => u.propertyId === propertyId && u.buildingId === buildingId);
  const currentUnitTenants = tenants.filter((t: any) => t.unitId === unitId);

  // Auto-set single tenant if only one exists in selected unit
  useEffect(() => {
    if (type === 'tenant') {
      if (currentUnitTenants.length === 1) {
        setTenantId(currentUnitTenants[0].id);
      } else {
        setTenantId('');
      }
    }
  }, [unitId, tenants, type]);

  // Auto-set owner info when property is selected
  useEffect(() => {
    if (type === 'owner' && propertyId) {
      const selectedProp = properties.find((p: any) => p.id === propertyId);
      if (selectedProp && selectedProp.ownerId) {
        setOwnerId(selectedProp.ownerId);
      } else {
        setOwnerId('');
      }
    }
  }, [propertyId, properties, type]);

  // Handle file selections & size checks (max 1 MB)
  const processFile = (selectedFile: File) => {
    setErrorMsg('');
    if (selectedFile.size > 1 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 1 MB limit. Please select a smaller file.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    // Remove extension from default doc name
    const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
    setDocName(nameWithoutExt);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const selected = e.dataTransfer.files[0];
    if (selected) processFile(selected);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
  };

  // Submit flow
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a file to upload.');
      return;
    }

    // Valdiations based on type
    if (type === 'owner') {
      if (!propertyId) {
        setErrorMsg('Please select a property.');
        return;
      }
    } else {
      if (!propertyId) {
        setErrorMsg('Please select a property.');
        return;
      }
      if (!buildingId) {
        setErrorMsg('Please select a building.');
        return;
      }
      if (!unitId) {
        setErrorMsg('Please select a unit.');
        return;
      }
      if (!tenantId) {
        setErrorMsg('Please select a tenant. The unit must have an assigned tenant.');
        return;
      }
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', docName || file.name);
      formData.append('category', category);
      formData.append('propertyId', propertyId);

      if (type === 'owner') {
        formData.append('ownerId', ownerId);
        await api.documents.uploadOwnerDoc(formData);
      } else {
        formData.append('buildingId', buildingId);
        formData.append('unitId', unitId);
        formData.append('tenantId', tenantId);
        await api.documents.uploadTenantDoc(formData);
      }

      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['docs-all'] });
      if (onSuccess) onSuccess();
      
      // Close modal on success after delay
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to find selected owner name to display
  const getOwnerDisplayName = () => {
    if (!propertyId) return 'Select a property first';
    const selectedProp = properties.find((p: any) => p.id === propertyId);
    if (selectedProp && selectedProp.owner) {
      const o = selectedProp.owner;
      const fullName = o.name || `${o.firstName || ''} ${o.lastName || ''}`.trim() || 'Unknown';
      return `${fullName} (${o.companyName || 'Individual'})`;
    }
    return 'No owner assigned to this property';
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={type === 'owner' ? 'Upload Document for Owner' : 'Upload Document for Tenant'}
      description={
        type === 'owner'
          ? 'Upload tax, statement, or contract documents associated directly with property owners.'
          : 'Upload lease, receipt, or notice documents associated with specific tenant units.'
      }
    >
      {success ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
          <CheckCircle className="w-14 h-14 text-emerald-500 animate-bounce" />
          <h3 className="text-lg font-bold text-foreground">Upload Successful!</h3>
          <p className="text-xs text-muted-foreground">The file has been uploaded to Cloudinary and cataloged.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Cascading selection inputs */}
          <div className="space-y-3">
            {/* Property Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Property</label>
              <Select
                value={propertyId}
                onChange={(e: any) => {
                  setPropertyId(e.target.value);
                  setBuildingId('');
                  setUnitId('');
                  setTenantId('');
                }}
                required
              >
                <option value="">Select Property...</option>
                {properties.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* OWNER FLOW: Show owner details */}
            {type === 'owner' && propertyId && (
              <div className="p-3 bg-secondary/20 border border-border rounded-xl">
                <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-0.5">Associated Owner</label>
                <span className="text-xs font-bold text-foreground">{getOwnerDisplayName()}</span>
              </div>
            )}

            {/* TENANT FLOW: Cascading selectors */}
            {type === 'tenant' && propertyId && (
              <>
                {/* Building Selector */}
                <div className="space-y-1 animate-fade-in">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Building</label>
                  <Select
                    value={buildingId}
                    onChange={(e: any) => {
                      setBuildingId(e.target.value);
                      setUnitId('');
                      setTenantId('');
                    }}
                    required
                  >
                    <option value="">Select Building...</option>
                    {filteredBuildings.map((b: any) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </Select>
                  {filteredBuildings.length === 0 && (
                    <p className="text-[10px] text-amber-500 font-bold">No buildings registered for this property.</p>
                  )}
                </div>

                {/* Unit Selector */}
                {buildingId && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Unit</label>
                    <Select
                      value={unitId}
                      onChange={(e: any) => {
                        setUnitId(e.target.value);
                        setTenantId('');
                      }}
                      required
                    >
                      <option value="">Select Unit...</option>
                      {filteredUnits.map((u: any) => (
                        <option key={u.id} value={u.id}>
                          Unit {u.unitNumber} ({u.status})
                        </option>
                      ))}
                    </Select>
                    {filteredUnits.length === 0 && (
                      <p className="text-[10px] text-amber-500 font-bold">No units registered in this building.</p>
                    )}
                  </div>
                )}

                {/* Tenant Info display */}
                {unitId && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Tenant</label>
                    {currentUnitTenants.length > 0 ? (
                      <Select
                        value={tenantId}
                        onChange={(e: any) => setTenantId(e.target.value)}
                        required
                      >
                        <option value="">Select Tenant...</option>
                        {currentUnitTenants.map((t: any) => (
                          <option key={t.id} value={t.id}>
                            {t.firstName} {t.lastName}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <div className="p-3 bg-rose-500/5 border border-rose-500/10 text-rose-400 text-xs font-bold rounded-xl flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        No active tenant assigned to this unit. Document upload is disabled.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Category</label>
              <Select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                required
              >
                {(type === 'owner' ? ownerCategories : tenantCategories).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>

            {/* Document Name input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Document Display Name</label>
              <Input
                placeholder="E.g., Lease_Agreement_2026"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* File Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center transition cursor-pointer ${
              dragging ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50 hover:bg-secondary/10'
            }`}
            onClick={() => document.getElementById('modal-file-input')?.click()}
          >
            <input
              id="modal-file-input"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,text/plain"
            />
            {file ? (
              <>
                <FileText className="w-10 h-10 text-primary" />
                <div>
                  <p className="font-bold text-xs max-w-[300px] truncate text-foreground">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setDocName(''); }}
                  className="text-rose-500 text-[10px] font-black uppercase flex items-center gap-1 hover:underline"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-muted-foreground opacity-50" />
                <div>
                  <p className="font-extrabold text-xs text-foreground">Drag & drop document here</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">or click to browse. Max 1 MB.</p>
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!file || isUploading || (type === 'tenant' && !tenantId) || (type === 'owner' && !propertyId)}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </form>
      )}
    </FormDialog>
  );
};
