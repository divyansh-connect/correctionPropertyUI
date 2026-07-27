import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { Landmark, Save, CheckCircle, Loader2 } from 'lucide-react';

export const OwnerProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [bankName, setBankName] = useState('Chase checking');
  const [accountNumber, setAccountNumber] = useState('XXXX-XXXX-9822');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['owner-profile'],
    queryFn: () => api.ownerProfile.get(),
  });

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || 'William');
      setLastName(profile.lastName || 'Anderson');
      setPhone(profile.phone || '(212) 555-0122');
      setEmail(profile.email || 'bill.a@investments.com');
      setStreetAddress(profile.streetAddress || '742 Evergreen Terrace, New York, NY');
      setBankName(profile.bankName || 'Chase checking');
      setAccountNumber(profile.accountNumber || 'XXXX-XXXX-9822');
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (updatedData: any) => api.ownerProfile.update(updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-profile'] });
      setSuccessMessage('Profile saved successfully to database.');
      setTimeout(() => setSuccessMessage(''), 4000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      firstName,
      lastName,
      phone,
      email,
      streetAddress,
      bankName,
      accountNumber,
    });
  };

  if (isLoading) {
    return <LoadingSkeleton type="card" />;
  }

  return (
    <div className="space-y-6 text-foreground max-w-4xl">
      <PageHeader
        title="My Investor Profile"
        description="Verify direct deposit banking configurations, mailing addresses, and security passwords."
        breadcrumbs={[
          { label: 'Home', href: '/owner' },
          { label: 'Profile' },
        ]}
      />

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Details */}
        <Card className="md:col-span-2 p-6 border bg-card space-y-6">
          <h3 className="font-extrabold text-sm uppercase border-b pb-2 tracking-wider">Mailing & Contact Info</h3>
          
          <div className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">First Name</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Last Name</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Phone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Mailing Street Address</label>
              <Input value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} required />
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={updateMutation.isPending} className="flex items-center gap-2">
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes to DB
              </Button>
            </div>
          </div>
        </Card>

        {/* Payout Bank Setup */}
        <Card className="md:col-span-1 p-6 border bg-card space-y-4">
          <h3 className="font-extrabold text-sm uppercase border-b pb-2 tracking-wider">ACH Direct Deposit</h3>
          <div className="space-y-3.5 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Landmark className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="font-bold text-foreground">{bankName}</p>
                <p className="font-mono text-[10px]">{accountNumber}</p>
              </div>
            </div>
            <p className="text-[10px] uppercase font-bold text-emerald-500">Routing status: Verified</p>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default OwnerProfilePage;
