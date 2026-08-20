import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToastStore } from '../store/useToastStore';
import api from '../lib/axios';
import AdminLayout from '../components/AdminLayout';
import PageHeader from '../components/PageHeader';
import { Save, Loader2, Settings } from 'lucide-react';

export default function EmailSetup() {
  const { addToast } = useToastStore();

  const [host, setHost] = useState('');
  const [port, setPort] = useState(587);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');

  const { data: smtpData, isLoading } = useQuery({
    queryKey: ['email-setup'],
    queryFn: async () => {
      const res = await api.get('/cms/email-setup');
      return res.data.data;
    },
  });

  useEffect(() => {
    if (smtpData) {
      setHost(smtpData.host || '');
      setPort(smtpData.port || 587);
      setUsername(smtpData.username || '');
      setPassword(smtpData.password || '');
      setFromName(smtpData.fromName || '');
      setFromEmail(smtpData.fromEmail || '');
    }
  }, [smtpData]);

  const saveMutation = useMutation({
    mutationFn: (data) => api.post('/cms/email-setup', data),
    onSuccess: () => {
      addToast('SMTP configurations saved successfully', 'success');
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to save SMTP setups', 'error');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!host || !port || !username || !password || !fromName || !fromEmail) {
      addToast('Please fill out all fields', 'warning');
      return;
    }

    saveMutation.mutate({
      host,
      port: Number(port),
      username,
      password,
      fromName,
      fromEmail,
    });
  };

  return (
    <AdminLayout>
      <PageHeader
        title="SMTP Settings Setup"
        subtitle="Configure the default transactional outgoing email server credentials."
        breadcrumbs={[{ label: 'CMS' }, { label: 'Email Setup' }]}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-adm-surface border border-adm-line rounded-xl shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-adm-primary" />
        </div>
      ) : (
        <div className="max-w-2xl bg-adm-surface border border-adm-line rounded-xl shadow-sm p-8 text-adm-text">
          <div className="flex items-center gap-2 pb-4 border-b border-adm-line mb-6 bg-adm-surface">
            <Settings className="h-5 w-5 text-adm-primary" />
            <h2 className="text-base font-bold">Mail Server Credentials (SMTP)</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
                  SMTP Server Host *
                </label>
                <input
                  type="text"
                  required
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
                  placeholder="smtp.mailtrap.io or smtp.gmail.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
                  Port Number *
                </label>
                <input
                  type="number"
                  required
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
                  placeholder="587 / 465 / 25"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
                  SMTP Username *
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
                  placeholder="Username / API Key"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
                  SMTP Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-adm-line">
              <div>
                <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
                  Sender Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
                  placeholder="Shreeraj Traders Team"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
                  Sender Outgoing Email *
                </label>
                <input
                  type="email"
                  required
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
                  placeholder="no-reply@shreeraj.com"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-adm-primary hover:bg-adm-primary-hover text-adm-primary-fg rounded-lg transition-all shadow-adm-sm cursor-pointer disabled:opacity-50"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <Save className="h-4.5 w-4.5" />
                )}
                <span>Save SMTP Setup</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
