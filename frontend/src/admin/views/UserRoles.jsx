import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import api from '../lib/axios';
import AdminLayout from '../components/AdminLayout';
import PageHeader from '../components/PageHeader';
import { Loader2, ShieldCheck, Save } from 'lucide-react';

export default function UserRoles() {
  const { addToast } = useToastStore();
  const { permittedMenus, permissions, user } = useAuthStore();

  const activePermissions = React.useMemo(() => {
    const currentMenu = permittedMenus.find((m) => m.route === '/admin/setup/user-roles');
    const rolePerm = permissions.find((p) => p.menuId === currentMenu?._id);
    const isSuper = user?.role === 'Super Admin';
    return {
      canView: rolePerm?.canView || isSuper,
      canEdit: rolePerm?.canEdit || isSuper,
    };
  }, [permittedMenus, permissions, user]);

  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [matrixPermissions, setMatrixPermissions] = useState([]);

  const { data: roles, isLoading: loadingRoles } = useQuery({
    queryKey: ['roles-list'],
    queryFn: async () => {
      const res = await api.get('/roles?limit=100&isActive=true');
      return res.data.data;
    },
  });

  const { data: menus, isLoading: loadingMenus } = useQuery({
    queryKey: ['all-menus-list'],
    queryFn: async () => {
      const res = await api.get('/menu-master?limit=200&isActive=true');
      return res.data.data;
    },
  });

  const { isLoading: loadingMatrix } = useQuery({
    queryKey: ['role-permissions-matrix', selectedRoleId],
    queryFn: async () => {
      if (!selectedRoleId) return null;
      const res = await api.get(`/roles-permissions/${selectedRoleId}`);
      const data = res.data.data?.permissions || [];
      setMatrixPermissions(data);
      return data;
    },
    enabled: !!selectedRoleId,
  });

  const saveMutation = useMutation({
    mutationFn: (data) => api.post('/roles-permissions', data),
    onSuccess: () => {
      addToast('Permissions matrix updated successfully', 'success');
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to update matrix', 'error');
    },
  });

  const handleCheckboxChange = (menuId, action, checked) => {
    setMatrixPermissions((prev) => {
      const exists = prev.find((p) => (typeof p.menuId === 'object' ? p.menuId._id : p.menuId) === menuId);
      if (exists) {
        return prev.map((p) =>
          (typeof p.menuId === 'object' ? p.menuId._id : p.menuId) === menuId
            ? { ...p, [action]: checked }
            : p,
        );
      } else {
        return [
          ...prev,
          {
            menuId,
            canView: action === 'canView' ? checked : false,
            canCreate: action === 'canCreate' ? checked : false,
            canEdit: action === 'canEdit' ? checked : false,
            canDelete: action === 'canDelete' ? checked : false,
          },
        ];
      }
    });
  };

  const handleSave = () => {
    if (!selectedRoleId) return;
    const formattedPerms = matrixPermissions.map((p) => ({
      menuId: typeof p.menuId === 'object' ? p.menuId._id : p.menuId,
      canView: p.canView || false,
      canCreate: p.canCreate || false,
      canEdit: p.canEdit || false,
      canDelete: p.canDelete || false,
    }));

    saveMutation.mutate({
      roleId: selectedRoleId,
      permissions: formattedPerms,
    });
  };

  const getPermissionVal = (menuId, action) => {
    const perm = matrixPermissions.find(
      (p) => (typeof p.menuId === 'object' ? p.menuId._id : p.menuId) === menuId,
    );
    return perm ? !!perm[action] : false;
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Roles Permissions Matrix"
        subtitle="Configure access scopes (View, Create, Edit, Delete) for system routes per role."
        breadcrumbs={[{ label: 'Setup' }, { label: 'Permissions Matrix' }]}
        action={
          selectedRoleId &&
          activePermissions.canEdit && (
            <button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-adm-primary hover:bg-adm-primary-hover text-adm-primary-fg rounded-lg transition-all shadow-adm-sm cursor-pointer disabled:opacity-50 animate-fadeIn"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <Save className="h-4.5 w-4.5" />
              )}
              <span>Save Matrix Changes</span>
            </button>
          )
        }
      />

      <div className="bg-adm-surface border border-adm-line rounded-xl shadow-sm p-6 mb-8 text-adm-text">
        <div className="max-w-xs space-y-1.5 mb-6">
          <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide">
            Target Role Designation
          </label>
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:ring-2 focus:ring-adm-primary/30 cursor-pointer"
          >
            <option value="">-- Choose Role designation --</option>
            {roles
              ?.filter((r) => r.name !== 'Super Admin')
              .map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
          </select>
        </div>

        {loadingRoles || loadingMenus ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-adm-primary" />
          </div>
        ) : !selectedRoleId ? (
          <div className="text-center py-16 text-adm-faint">
            <ShieldCheck className="h-12 w-12 stroke-1 mx-auto mb-3" />
            <p className="text-sm font-semibold">Select a role to configure route authorization guards</p>
          </div>
        ) : loadingMatrix ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-adm-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto border border-adm-line-soft rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-adm-surface-2 border-b border-adm-line">
                  <th className="px-6 py-4.5 text-xs font-bold text-adm-muted uppercase tracking-wider">
                    Group Name
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold text-adm-muted uppercase tracking-wider">
                    Menu Page Label
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold text-adm-muted uppercase tracking-wider">
                    Route Path Slug
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold text-adm-muted uppercase tracking-wider text-center w-24">
                    View
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold text-adm-muted uppercase tracking-wider text-center w-24">
                    Create
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold text-adm-muted uppercase tracking-wider text-center w-24">
                    Edit
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold text-adm-muted uppercase tracking-wider text-center w-24">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-adm-line-soft">
                {menus?.map((menu) => (
                  <tr key={menu._id} className="hover:bg-adm-surface-2 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-adm-muted">
                      {typeof menu.menuGroupId === 'object' ? menu.menuGroupId.name : 'Master'}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-adm-text">{menu.label}</td>
                    <td className="px-6 py-4 text-sm font-mono font-bold text-adm-primary">{menu.route}</td>

                    {/* View checkbox */}
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={getPermissionVal(menu._id, 'canView')}
                        disabled={!activePermissions.canEdit}
                        onChange={(e) => handleCheckboxChange(menu._id, 'canView', e.target.checked)}
                        className="rounded border-adm-line-strong text-adm-primary focus:ring-adm-primary/30 h-4.5 w-4.5 cursor-pointer disabled:opacity-40"
                      />
                    </td>

                    {/* Create checkbox */}
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={getPermissionVal(menu._id, 'canCreate')}
                        disabled={!activePermissions.canEdit}
                        onChange={(e) => handleCheckboxChange(menu._id, 'canCreate', e.target.checked)}
                        className="rounded border-adm-line-strong text-adm-primary focus:ring-adm-primary/30 h-4.5 w-4.5 cursor-pointer disabled:opacity-40"
                      />
                    </td>

                    {/* Edit checkbox */}
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={getPermissionVal(menu._id, 'canEdit')}
                        disabled={!activePermissions.canEdit}
                        onChange={(e) => handleCheckboxChange(menu._id, 'canEdit', e.target.checked)}
                        className="rounded border-adm-line-strong text-adm-primary focus:ring-adm-primary/30 h-4.5 w-4.5 cursor-pointer disabled:opacity-40"
                      />
                    </td>

                    {/* Delete checkbox */}
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={getPermissionVal(menu._id, 'canDelete')}
                        disabled={!activePermissions.canEdit}
                        onChange={(e) => handleCheckboxChange(menu._id, 'canDelete', e.target.checked)}
                        className="rounded border-adm-line-strong text-adm-primary focus:ring-adm-primary/30 h-4.5 w-4.5 cursor-pointer disabled:opacity-40"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
