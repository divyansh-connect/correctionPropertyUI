import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuthStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Loader2, Mail, Lock, ShieldCheck } from 'lucide-react';

const loginSchema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Invalid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormInputs = zod.infer<typeof loginSchema>;

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { login } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'manager@apexpm.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setApiError(null);
    try {
      await login(data.email);
      const emailLower = data.email.toLowerCase();
      if (emailLower.includes('owner')) {
        navigate('/owner');
      } else if (emailLower.includes('tenant')) {
        navigate('/tenant');
      } else if (emailLower.includes('staff') || emailLower.includes('tech')) {
        navigate('/staff/maintenance');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setApiError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <div className="flex justify-start">
        <button
          type="button"
          onClick={() => navigate('/landing')}
          className="text-xs font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors duration-200 flex items-center gap-1"
        >
          ← Back
        </button>
      </div>

      <div className="text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Access Gate</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in to begin lease simulations</p>
      </div>

      {apiError && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 p-3 rounded-lg text-xs font-semibold text-center">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              type="email"
              placeholder="manager@apexpm.com"
              {...register('email')}
              className="pl-10 bg-white dark:bg-slate-950/40 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-primary focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            />
          </div>
          {errors.email && (
            <p className="text-rose-500 dark:text-rose-400 text-xs font-semibold mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Password
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-xs text-primary font-bold hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="pl-10 bg-white dark:bg-slate-950/40 border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-primary focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            />
          </div>
          {errors.password && (
            <p className="text-rose-500 dark:text-rose-400 text-xs font-semibold mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full flex items-center justify-center h-10 font-bold bg-primary text-white hover:bg-primary/90 mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Sign In
        </Button>

        {/* Quick Demo Portals Autofill */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-widest text-center">
            Demo Portal Access
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => {
                setValue('email', 'admin@apexpm.com');
                setValue('password', 'password123');
                onSubmit({ email: 'admin@apexpm.com', password: 'password123' });
              }}
              className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 p-2 rounded-xl transition text-center"
            >
              🔑 Super Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setValue('email', 'manager@apexpm.com');
                setValue('password', 'password123');
                onSubmit({ email: 'manager@apexpm.com', password: 'password123' });
              }}
              className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 p-2 rounded-xl transition text-center"
            >
              💼 Manager
            </button>
            <button
              type="button"
              onClick={() => {
                setValue('email', 'owner@apexpm.com');
                setValue('password', 'password123');
                onSubmit({ email: 'owner@apexpm.com', password: 'password123' });
              }}
              className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 p-2 rounded-xl transition text-center"
            >
              👑 Owner Portal
            </button>
            <button
              type="button"
              onClick={() => {
                setValue('email', 'tenant@apexpm.com');
                setValue('password', 'password123');
                onSubmit({ email: 'tenant@apexpm.com', password: 'password123' });
              }}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 p-2 rounded-xl transition text-center"
            >
              🏠 Tenant Portal
            </button>
            <button
              type="button"
              onClick={() => {
                setValue('email', 'staff@apexpm.com');
                setValue('password', 'password123');
                onSubmit({ email: 'staff@apexpm.com', password: 'password123' });
              }}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/20 p-2 rounded-xl transition text-center col-span-2"
            >
              🛠️ Maintenance Staff
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
