import { Shield, Calendar, LogOut, Lock } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProfilePage() {
  const { user, role, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      <PageHeader title="My Profile" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - User Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600 to-blue-400"></div>
            
            <div className="relative mt-4">
              <div className="w-24 h-24 rounded-full bg-white p-1 mx-auto shadow-lg relative z-10">
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
              </div>
              
              <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 font-medium">{user.email}</p>
              
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-xs font-bold uppercase">{role?.name}</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 gap-4 text-left">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-400 font-medium leading-none">Joined since</p>
                  <p className="text-gray-700 font-bold mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors border border-red-100"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        {/* Right Column - Profile Details & Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
                <p className="text-sm font-bold text-gray-700">{user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-bold text-gray-700">{user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Role</p>
                <p className="text-sm font-bold text-gray-700">{role?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Status</p>
                <StatusBadge status={user.status} variant={user.status === "active" ? "success" : "danger"} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Security & Privacy</h3>
            </div>
            <div className="p-6 divide-y divide-gray-100">
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">Account Password</p>
                  </div>
                </div>
                <Link
                  to="/profile/change-password"
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
