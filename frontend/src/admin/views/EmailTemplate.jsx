import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import api from '../lib/axios';
import AdminLayout from '../components/AdminLayout';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Plus, Send, Info, Loader2 } from 'lucide-react';

export default function EmailTemplate() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { permittedMenus, permissions, user } = useAuthStore();
  const textareaRef = useRef(null);

  const activePermissions = React.useMemo(() => {
    const currentMenu = permittedMenus.find((m) => m.route === '/admin/cms/email-template');
    const rolePerm = permissions.find((p) => p.menuId === currentMenu?._id);
    const isSuper = user?.role === 'Super Admin';
    return {
      canView: rolePerm?.canView || isSuper,
      canCreate: rolePerm?.canCreate || isSuper,
      canEdit: rolePerm?.canEdit || isSuper,
      canDelete: rolePerm?.canDelete || isSuper,
    };
  }, [permittedMenus, permissions, user]);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState([{ id: 'createdAt', desc: true }]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [templateName, setTemplateName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [variablesInput, setVariablesInput] = useState('name, otp, link');
  const [activeTab, setActiveTab] = useState('editor');
  const [testEmail, setTestEmail] = useState('');

  const sortField = sorting[0]?.id || 'createdAt';
  const sortOrder = sorting[0]?.desc ? 'desc' : 'asc';

  const { data: listData, isLoading } = useQuery({
    queryKey: ['email-templates-list', pageIndex, pageSize, search, sortField, sortOrder],
    queryFn: async () => {
      const res = await api.get('/cms/email-templates', {
        params: {
          page: pageIndex,
          limit: pageSize,
          search,
          sortBy: sortField,
          order: sortOrder,
        },
      });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/cms/email-templates', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates-list'] });
      addToast('Email template created successfully', 'success');
      closeForm();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Creation failed', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/cms/email-templates/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates-list'] });
      addToast('Email template updated successfully', 'success');
      closeForm();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/cms/email-templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates-list'] });
      addToast('Email template deleted successfully', 'success');
      setIsDeleteOpen(false);
      setSelectedRecord(null);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Deletion failed', 'error');
    },
  });

  const testSendMutation = useMutation({
    mutationFn: (payload) => api.post('/cms/test-send', payload),
    onSuccess: () => {
      addToast('Test email sent successfully via SMTP!', 'success');
      setIsTestOpen(false);
      setTestEmail('');
      setSelectedRecord(null);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to send test email', 'error');
    },
  });

  const handleOpenAdd = () => {
    setSelectedRecord(null);
    setTemplateName('');
    setSubject('');
    setBody(
      '<h3>Hello {{name}},</h3>\n<p>Your OTP code is <strong>{{otp}}</strong>.</p>\n<p>Regards,<br>Shreeraj Traders</p>',
    );
    setVariablesInput('name, otp');
    setActiveTab('editor');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (rec) => {
    setSelectedRecord(rec);
    setTemplateName(rec.name);
    setSubject(rec.subject);
    setBody(rec.body);
    setVariablesInput(rec.variables.join(','));
    setActiveTab('editor');
    setIsFormOpen(true);
  };

  const handleOpenDelete = (rec) => {
    setSelectedRecord(rec);
    setIsDeleteOpen(true);
  };

  const handleOpenTest = (rec) => {
    setSelectedRecord(rec);
    setTestEmail('');
    setIsTestOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedRecord(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!templateName || !subject || !body) {
      addToast('Fill out all required fields', 'warning');
      return;
    }

    const parsedVars = variablesInput
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '');

    const payload = {
      name: templateName,
      subject,
      body,
      variables: parsedVars,
    };

    if (selectedRecord) {
      updateMutation.mutate({ id: selectedRecord._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleInsertVariable = (variable) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const placeholder = `{{${variable}}}`;
    const newBody = body.substring(0, startPos) + placeholder + body.substring(endPos, body.length);

    setBody(newBody);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = startPos + placeholder.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  const handleTestSendSubmit = (e) => {
    e.preventDefault();
    if (!testEmail || !selectedRecord) {
      addToast('Recipient email is required', 'warning');
      return;
    }

    testSendMutation.mutate({
      templateId: selectedRecord._id,
      testEmail,
    });
  };

  const availableVars = variablesInput
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v !== '');

  const getRenderedPreview = () => {
    let preview = body;
    const mockVals = {
      name: 'John Doe',
      otp: '982741',
      link: 'https://shreeraj-traders.com/reset',
      email: user?.email || 'admin@shreeraj.com',
      date: new Date().toLocaleDateString(),
    };

    availableVars.forEach((v) => {
      const regex = new RegExp(`{{${v}}}`, 'g');
      preview = preview.replace(regex, mockVals[v] || `[${v}]`);
    });

    return preview;
  };

  const columns = [
    {
      id: 'srNo',
      header: 'Sr No',
      cell: ({ row }) => <span>{(pageIndex - 1) * pageSize + row.index + 1}</span>,
      size: 60,
    },
    {
      accessorKey: 'name',
      header: 'Template Name',
      cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.name}</span>,
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
    },
    {
      id: 'variables',
      header: 'Variables Mapped',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.variables.map((v, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded bg-adm-surface-3 text-[10px] font-semibold text-adm-muted font-mono"
            >
              {v}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Email Templates Management"
        subtitle="Manage rich transactional email configurations with customizable variables and preview test senders."
        breadcrumbs={[{ label: 'CMS' }, { label: 'Email Templates' }]}
        action={
          activePermissions.canCreate && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-adm-primary hover:bg-adm-primary-hover text-adm-primary-fg rounded-lg transition-all shadow-adm-sm cursor-pointer animate-fadeIn"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Add Template</span>
            </button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={listData?.data || []}
        isLoading={isLoading}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRecords={listData?.meta?.total || 0}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
        search={search}
        onSearchChange={setSearch}
        sorting={sorting}
        onSortingChange={setSorting}
        onEdit={activePermissions.canEdit ? handleOpenEdit : undefined}
        onDelete={activePermissions.canDelete ? handleOpenDelete : undefined}
        onView={handleOpenTest}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={selectedRecord ? 'Edit Email Template' : 'Add Email Template'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6 text-adm-text">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
                Template Name *
              </label>
              <input
                type="text"
                required
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
                placeholder="Welcome Onboarding Email"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
                Template Variable Placeholders (comma-separated)
              </label>
              <input
                type="text"
                value={variablesInput}
                onChange={(e) => setVariablesInput(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 font-mono text-adm-text"
                placeholder="name, otp, link, date"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
              Email Subject *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 font-semibold text-adm-text"
              placeholder="Welcome to Shreeraj Traders, {{name}}!"
            />
          </div>

          <div className="border-b border-adm-line">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`py-2 text-sm font-semibold border-b-2 px-1 cursor-pointer transition-colors ${
                  activeTab === 'editor'
                    ? 'border-adm-primary text-adm-primary'
                    : 'border-transparent text-adm-muted hover:text-adm-text'
                }`}
              >
                HTML Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`py-2 text-sm font-semibold border-b-2 px-1 cursor-pointer transition-colors ${
                  activeTab === 'preview'
                    ? 'border-adm-primary text-adm-primary'
                    : 'border-transparent text-adm-muted hover:text-adm-text'
                }`}
              >
                Template Live Preview
              </button>
            </div>
          </div>

          {activeTab === 'editor' ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-2">
                <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide">
                  HTML Document Body *
                </label>
                <textarea
                  ref={textareaRef}
                  required
                  rows={10}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-adm-surface border border-adm-line rounded-lg focus:outline-none focus:ring-2 focus:ring-adm-primary/30 font-mono text-adm-text"
                  placeholder="<h2>Heading</h2><p>Provide message HTML</p>"
                />
              </div>

              <div className="space-y-4 bg-adm-surface-2 border border-adm-line p-4 rounded-xl self-start">
                <div className="flex items-center gap-1.5 text-adm-text font-bold text-xs">
                  <Info className="h-4 w-4 shrink-0 text-adm-faint" />
                  <span>Insert Variable Tokens</span>
                </div>
                <div className="flex flex-col gap-2">
                  {availableVars.length > 0 ? (
                    availableVars.map((v, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleInsertVariable(v)}
                        className="w-full px-3 py-1.5 bg-adm-surface hover:bg-adm-primary-soft hover:text-adm-primary hover:border-adm-primary/40 border border-adm-line rounded-lg text-left text-xs font-mono font-semibold transition-all cursor-pointer truncate"
                      >
                        &#123;&#123;{v}&#125;&#125;
                      </button>
                    ))
                  ) : (
                    <span className="text-3xs text-adm-faint font-semibold uppercase leading-tight">
                      No variables declared.
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-adm-line rounded-xl p-4 bg-adm-surface-2 min-h-[300px] max-h-[450px] overflow-y-auto">
              <div
                className="bg-adm-surface border border-adm-line rounded-lg p-6 shadow-sm min-h-[250px]"
                dangerouslySetInnerHTML={{ __html: getRenderedPreview() }}
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-adm-line-soft">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 text-sm font-semibold border border-adm-line hover:bg-adm-surface-3 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-5 py-2 text-sm font-semibold bg-adm-primary hover:bg-adm-primary-hover text-adm-primary-fg rounded-lg transition-all shadow-adm-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <span>{selectedRecord ? 'Save Changes' : 'Create Template'}</span>
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isTestOpen}
        onClose={() => {
          setIsTestOpen(false);
          setSelectedRecord(null);
        }}
        title={`Send Test Email:"${selectedRecord?.name}"`}
        size="sm"
      >
        <form onSubmit={handleTestSendSubmit} className="space-y-4 text-adm-text">
          <div className="flex items-center gap-2 bg-adm-primary-soft text-adm-primary border border-adm-primary/20 p-4 rounded-xl text-xs font-semibold leading-relaxed">
            <Info className="h-4 w-4 shrink-0" />
            <span>
              Tapping send fires the SMTP server. Variable tags like name and otp will be parsed with mock
              tester parameters.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
              Test Recipient Email *
            </label>
            <input
              type="email"
              required
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
              placeholder="tester@domain.com"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-adm-line-soft">
            <button
              type="button"
              onClick={() => {
                setIsTestOpen(false);
                setSelectedRecord(null);
              }}
              className="px-4 py-2 text-sm font-semibold border border-adm-line hover:bg-adm-surface-3 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={testSendMutation.isPending}
              className="px-5 py-2 text-sm font-semibold bg-adm-primary hover:bg-adm-primary-hover text-adm-primary-fg rounded-lg transition-all shadow-adm-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {testSendMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>Send Test</span>
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedRecord(null);
        }}
        onConfirm={() => selectedRecord && deleteMutation.mutate(selectedRecord._id)}
        title="Confirm Template Deletion"
        message={`Are you sure you want to delete template"${selectedRecord?.name}"? Make sure it's not mapped to any Email Trigger Event mappings.`}
        isLoading={deleteMutation.isPending}
      />
    </AdminLayout>
  );
}
