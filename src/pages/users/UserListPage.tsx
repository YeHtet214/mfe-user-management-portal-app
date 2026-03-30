import { Plus, Eye, Edit2, UserX, UserCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { DataTable } from "../../components/shared/DataTable";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { SearchInput } from "../../components/shared/SearchInput";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";
import { fetchUsers, updateUserStatus } from "../../services/userApi";
import type { User, PaginationMeta } from "../../services/types";
import { useAuth } from "../../contexts/AuthContext";

export function UserListPage() {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchUsers({
        search: searchTerm,
        status: statusFilter,
        page: currentPage,
        per_page: 10
      });
      setUsers(response.data.data);
      console.log("Users data: ", response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, currentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getUsers();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [getUsers]);

  const handleStatusToggle = async () => {
    if (!selectedUser) return;
    try {
      const newStatus = selectedUser.status === "active" ? "inactive" : "active";
      await updateUserStatus(selectedUser.id, newStatus);
      setIsStatusDialogOpen(false);
      getUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const columns = [
    {
      header: "Name",
      accessor: (row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
            {row.name.substring(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 leading-none">{row.name}</p>
            <p className="text-xs text-gray-500 mt-1">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (row: User) => row.role?.name || 'N/A'
    },
    {
      header: "Status",
      accessor: (row: User) => (
        <StatusBadge
          status={row.status}
          variant={row.status === "active" ? "success" : "danger"}
        />
      ),
    },
    {
      header: "Created Date",
      accessor: (row: User) => new Date(row.created_at).toLocaleDateString()
    },
    {
      header: "Actions",
      accessor: (row: User) => (
        <div className="flex items-center gap-2">
          {hasPermission('users.view') && (
            <Link
              to={`/users/${row.id}`}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
          )}
          {hasPermission('users.create') && (
            <Link
              to={`/users/${row.id}/edit`}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit User"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
          )}
          {hasPermission('users.create') && (
            <button
              onClick={() => {
                setSelectedUser(row);
                setIsStatusDialogOpen(true);
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title={row.status === "active" ? "Deactivate User" : "Activate User"}
            >
              {row.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="User Management"
        actions={hasPermission('users.create') && (
          <Link
            to="/users/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 !text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create User
          </Link>
        )}
      />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <SearchInput
            placeholder="Search users by name or email..."
            containerClassName="sm:max-w-xs w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <DataTable columns={columns as any} data={users} isLoading={loading} />

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold">{meta.from}</span> to <span className="font-semibold">{meta.to}</span> of <span className="font-semibold">{meta.total}</span> users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-gray-700 px-4">
                Page {currentPage} of {meta.last_page}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, meta.last_page))}
                disabled={currentPage === meta.last_page || loading}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={handleStatusToggle}
        title={selectedUser?.status === "active" ? "Deactivate User" : "Reactivate User"}
        description={`Are you sure you want to ${selectedUser?.status === "active" ? "deactivate" : "reactivate"} user "${selectedUser?.name}"?`}
        confirmText={selectedUser?.status === "active" ? "Deactivate" : "Reactivate"}
        variant={selectedUser?.status === "active" ? "danger" : "info"}
      />
    </div>
  );
}
