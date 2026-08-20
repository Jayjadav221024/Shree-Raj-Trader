import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import api from '../lib/axios';
import AdminLayout from '../components/AdminLayout';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Plus, MailWarning, Loader2 } from 'lucide-react';

export default function EmailFor() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { permittedMenus, permissions, user } = useAuthStore();

  const activePermissions = React.useMemo(() => {
    const currentMenu = permittedMenus.find((m) => m.route === '/admin/cms/email-for');
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
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [eventCode, setEventCode] = useState('');
  const [eventName, setEventName] = useState('');
  const [templateId, setTemplateId] = useState('');

  const { data: templates } = useQuery({
    queryKey: ['templates-dropdown'],
    queryFn: async () => {
      const res = await api.get('/cms/email-templates?limit=100');
      return res.data.data;
    },
  });

  const sortField = sorting[0]?.id || 'createdAt';
  const sortOrder = sorting[0]?.desc ? 'desc' : 'asc';

  const { data: listData, isLoading } = useQuery({
    queryKey: ['email-for-list', pageIndex, pageSize, search, sortField, sortOrder],
    queryFn: async () => {
      const res = await api.get('/cms/email-for', {
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
    mutationFn: (data) => api.post('/cms/email-for', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-for-list'] });
      addToast('Event mapping created successfully', 'success');
      closeForm();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Creation failed', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/cms/email-for/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-for-list'] });
      addToast('Event mapping updated successfully', 'success');
      closeForm();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/cms/email-for/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-for-list'] });
      addToast('Event mapping deleted successfully', 'success');
      setIsDeleteOpen(false);
      setSelectedRecord(null);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Deletion failed', 'error');
    },
  });

  const handleOpenAdd = () => {
    setSelectedRecord(null);
    setEventCode('');
    setEventName('');
    setTemplateId('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (rec) => {
    setSelectedRecord(rec);
    setEventCode(rec.eventCode);
    setEventName(rec.eventName);
    setTemplateId(
      rec.templateId ? (typeof rec.templateId === 'object' ? rec.templateId._id : rec.templateId) : '',
    );
    setIsFormOpen(true);
  };

  const handleOpenDelete = (rec) => {
    setSelectedRecord(rec);
    setIsDeleteOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedRecord(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventCode || !eventName) {
      addToast('Event Code and Name are required', 'warning');
      return;
    }

    const payload = {
      eventCode,
      eventName,
      templateId: templateId || null,
    };

    if (selectedRecord) {
      updateMutation.mutate({ id: selectedRecord._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns = [
    {
      id: 'srNo',
      header: 'Sr No',
      cell: ({ row }) => <span>{(pageIndex - 1) * pageSize + row.index + 1}</span>,
      size: 60,
    },
    {
      accessorKey: 'eventCode',
      header: 'Event Code',
      cell: ({ row }) => <span className="font-mono font-bold text-adm-text">{row.original.eventCode}</span>,
    },
    {
      accessorKey: 'eventName',
      header: 'Event Trigger Name',
    },
    {
      id: 'template',
      header: 'Mapped Template',
      cell: ({ row }) => {
        const temp = row.original.templateId;
        return temp ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-adm-success-soft text-adm-success">
            {typeof temp === 'object' ? temp.name : temp}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-adm-warning bg-adm-warning-soft px-2 py-0.5 rounded-full">
            <MailWarning className="h-3 w-3 shrink-0" />
            No Template
          </span>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Transactional Email Events Mapping"
        subtitle="Map system transactional events (e.g. welcome, password reset) to HTML email templates."
        breadcrumbs={[{ label: 'CMS' }, { label: 'Email Mappings' }]}
        action={
          activePermissions.canCreate && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-adm-primary hover:bg-adm-primary-hover text-adm-primary-fg rounded-lg transition-all shadow-adm-sm cursor-pointer animate-fadeIn"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Add Event Link</span>
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
      />

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={selectedRecord ? 'Edit Event Mapping' : 'Add Event Mapping'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
              Event Code *
            </label>
            <input
              type="text"
              required
              disabled={!!selectedRecord}
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 disabled:opacity-50 font-mono text-adm-text"
              placeholder="e.g. WELCOME_EMAIL"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
              Event Display Name *
            </label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
              placeholder="e.g. Welcome Customer Registration"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
              Linked Email Template
            </label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text cursor-pointer"
            >
              <option value="">-- No Template linked --</option>
              {templates?.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} (Subject: {t.subject})
                </option>
              ))}
            </select>
          </div>

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
              <span>{selectedRecord ? 'Save Changes' : 'Create Link'}</span>
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
        title="Confirm Deletion"
        message={`Are you sure you want to delete event mapping"${selectedRecord?.eventCode}"?`}
        isLoading={deleteMutation.isPending}
      />
    </AdminLayout>
  );
}
