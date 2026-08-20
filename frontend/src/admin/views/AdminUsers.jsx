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
import ActiveToggle from '../components/ActiveToggle';
import { Plus, Loader2 } from 'lucide-react';

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { permittedMenus, permissions, user } = useAuthStore();

  const activePermissions = React.useMemo(() => {
    const currentMenu = permittedMenus.find((m) => m.route === '/admin/setup/admin-users');
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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [roleId, setRoleId] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);

  const { data: roles } = useQuery({
    queryKey: ['roles-dropdown'],
    queryFn: async () => {
      const res = await api.get('/roles?limit=100&isActive=true');
      return res.data.data;
    },
  });

  const sortField = sorting[0]?.id || 'createdAt';
  const sortOrder = sorting[0]?.desc ? 'desc' : 'asc';

  const { data: listData, isLoading } = useQuery({
    queryKey: ['admin-users-list', pageIndex, pageSize, search, sortField, sortOrder],
    queryFn: async () => {
      const res = await api.get('/admin-users', {
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
    mutationFn: (data) => api.post('/admin-users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      addToast('Administrator account created successfully', 'success');
      closeForm();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to create user', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin-users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      addToast('Administrator account updated successfully', 'success');
      closeForm();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to update user', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin-users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      addToast('Administrator account deleted successfully', 'success');
      setIsDeleteOpen(false);
      setSelectedRecord(null);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to delete user', 'error');
    },
  });

  const handleOpenAdd = () => {
    setSelectedRecord(null);
    setName('');
    setEmail('');
    setMobile('');
    setRoleId('');
    setPassword('');
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (rec) => {
    setSelectedRecord(rec);
    setName(rec.name);
    setEmail(rec.email);
    setMobile(rec.mobile || '');
    setRoleId(typeof rec.roleId === 'object' ? rec.roleId._id : rec.roleId);
    setPassword('');
    setIsActive(rec.isActive);
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
    if (!name || !email || !roleId || (!selectedRecord && !password)) {
      addToast('Please fill out all required fields', 'warning');
      return;
    }

    const payload = {
      name,
      email,
      mobile,
      roleId,
      isActive,
    };

    if (password) {
      payload.password = password;
    }

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
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.name}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'mobile',
      header: 'Mobile',
    },
    {
      id: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.original.roleId;
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-adm-primary-soft text-adm-primary">
            {typeof role === 'object' ? role.name : 'Unknown'}
          </span>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            row.original.isActive
              ? 'bg-adm-success-soft text-adm-success'
              : 'bg-adm-danger-soft text-adm-danger'
          }`}
        >
          {row.original.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Admin Users Management"
        subtitle="Manage accounts, email logins, phone settings and user roles mappings."
        breadcrumbs={[{ label: 'Setup' }, { label: 'Admin Users' }]}
        action={
          activePermissions.canCreate && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-adm-primary hover:bg-adm-primary-hover text-adm-primary-fg rounded-lg transition-all shadow-adm-sm cursor-pointer animate-fadeIn"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Create User</span>
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
        title={selectedRecord ? 'Edit Administrator Profile' : 'Create Administrator'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
                User Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
                Account Role *
              </label>
              <select
                required
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text cursor-pointer"
              >
                <option value="">-- Select Role --</option>
                {roles?.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide mb-1.5">
              Secure Password {selectedRecord && '(leave blank to keep current)'} *
            </label>
            <input
              type="password"
              required={!selectedRecord}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
              placeholder={selectedRecord ? '••••••••' : 'Password text'}
            />
          </div>

          <div className="pt-2">
            <ActiveToggle value={isActive} onChange={setIsActive} label="Access Status Authorized" />
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
              <span>{selectedRecord ? 'Save Changes' : 'Create User'}</span>
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
        message={`Are you sure you want to delete user account"${selectedRecord?.name}"?`}
        isLoading={deleteMutation.isPending}
      />
    </AdminLayout>
  );
}
