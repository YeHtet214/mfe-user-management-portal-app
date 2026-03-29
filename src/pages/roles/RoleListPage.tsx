import { Plus, Edit2, Trash2, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { DataTable } from "../../components/shared/DataTable";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { useState, useEffect, useCallback } from "react";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";
import { fetchRoles, deleteRole } from "../../services/roleApi";
import type { Role } from "../../services/types";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../lib/utils";

export function RoleListPage() {
  const { hasPermission } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManage = hasPermission('roles.create');

  const getRoles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchRoles();
      if ('data' in response && Array.isArray(response.data)) {
        setRoles(response.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    try {
      setError(null);
      await deleteRole(selectedRole.id);
      setIsDeleteDialogOpen(false);
      getRoles();
    } catch (err: any) {
      if (err.response?.status === 422 || err.response?.status === 403) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred while deleting the role.");
      }
    }
  };

  const columns = [
    {
      header: "Role Name",
      accessor: (row: Role) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-gray-900 block">{row.name}</span>
            <span className="text-xs text-gray-500 uppercase font-mono">{row.slug}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Permissions",
      accessor: (row: Role) => (
        <StatusBadge status={`${row.permissions_count || 0} Permissions`} variant="info" />
      ),
    },
    { 
      header: "Created Date", 
      accessor: (row: Role) => new Date(row.created_at).toLocaleDateString() 
    },
    {
      header: "Actions",
      accessor: (row: Role) => (
        <div className="flex items-center gap-2">
          <Link
            to={canManage ? `/roles/${row.id}/edit` : "#"}
            onClick={(e) => !canManage && e.preventDefault()}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              canManage 
                ? "text-gray-400 hover:text-blue-600 hover:bg-blue-50" 
                : "text-gray-300 cursor-not-allowed opacity-50"
            )}
            title={canManage ? "Edit Role" : "Permission Denied"}
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              if (canManage) {
                setSelectedRole(row);
                setIsDeleteDialogOpen(true);
                setError(null);
              }
            }}
            disabled={!canManage}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              canManage 
                ? "text-gray-400 hover:text-red-600 hover:bg-red-50" 
                : "text-gray-300 cursor-not-allowed opacity-50"
            )}
            title={canManage ? "Delete Role" : "Permission Denied"}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Role Management"
        actions={
          <Link
            to={canManage ? "/roles/create" : "#"}
            onClick={(e) => !canManage && e.preventDefault()}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 font-bold rounded-xl shadow-lg transition-all",
              canManage
                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60 shadow-none"
            )}
          >
            <Plus className="w-4 h-4" />
            Create Role
          </Link>
        }
      />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <DataTable columns={columns as any} data={roles} isLoading={loading} />
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteRole}
        title="Delete Role"
        description={
          <div className="space-y-3">
            <p>Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be undone.</p>
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg font-medium">
                {error}
              </div>
            )}
          </div>
        }
        confirmText="Delete Role"
        variant="danger"
      />
    </div>
  );
}
