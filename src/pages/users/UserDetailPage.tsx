import { useParams, Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { Edit2, UserX, UserCheck, Key, Shield, AppWindow, Clock, Mail, Calendar, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";
import { fetchUser, updateUserStatus } from "../../services/userApi";
import type { User } from "../../services/types";
import { useAuth } from "../../contexts/AuthContext";

export function UserDetailPage() {
  const { id } = useParams();
  const { hasPermission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const getUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await fetchUser(Number(id));
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getUserData();
    }
  }, [getUserData]);

  const handleStatusToggle = async () => {
    if (!user) return;
    try {
      const newStatus = user.status === "active" ? "inactive" : "active";
      await updateUserStatus(user.id, newStatus);
      setIsStatusDialogOpen(false);
      getUserData();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      <PageHeader
        title="User Details"
        breadcrumbs={[
          { label: "User Management", path: "/users" },
          { label: user.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {hasPermission('users.create') && (
              <button
                onClick={() => setIsStatusDialogOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                {user.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                {user.status === "active" ? "Deactivate" : "Activate"}
              </button>
            )}
            {hasPermission('users.create') && (
              <Link
                to={`/users/${id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <Edit2 className="w-4 h-4" />
                Edit User
              </Link>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Info & Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl mx-auto mb-4">
              {user.name?.substring(0, 2) || 'N/A'}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name || 'N/A'}</h2>
            <p className="text-sm text-gray-500 font-medium">{user.email || 'N/A'}</p>
            <div className="mt-4">
              <StatusBadge status={user.status} variant={user.status === "active" ? "success" : "danger"} />
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 italic">Created on {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Role & Permissions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Assigned Role</h3>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border border-purple-200 uppercase tracking-wider">
                {user.role?.name || 'N/A'}
              </span>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-widest text-[10px]">Role Details</p>
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-800">{user.role?.name || 'N/A'}</p>
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">{user.role?.slug || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={handleStatusToggle}
        title={user.status === "active" ? "Deactivate User" : "Reactivate User"}
        description={`Are you sure you want to ${user.status === "active" ? "deactivate" : "reactivate"} "${user.name}"? This will ${user.status === "active" ? "disable" : "restore"} their access to the portal.`}
        confirmText={user.status === "active" ? "Deactivate" : "Reactivate"}
        variant={user.status === "active" ? "danger" : "info"}
      />
    </div>
  );
}
