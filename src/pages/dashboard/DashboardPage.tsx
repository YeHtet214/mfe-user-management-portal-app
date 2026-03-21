import {
  Users,
  ShieldCheck,
  AppWindow,
  UserPlus,
  ShieldPlus,
  ExternalLink,
  Clock,
} from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../lib/utils";

const stats = [
  { label: "Total Users", value: "1,248", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Active Users", value: "1,180", icon: Users, color: "text-green-600", bg: "bg-green-100" },
  { label: "Total Roles", value: "12", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-100" },
  { label: "Available Apps", value: "5", icon: AppWindow, color: "text-orange-600", bg: "bg-orange-100" },
];

const recentActivities = [
  { user: "Admin", action: "created user", target: "John Doe", time: "2 hours ago" },
  { user: "Admin", action: "updated role", target: "Manager", time: "5 hours ago" },
  { user: "System", action: "granted access", target: "Product App", time: "1 day ago" },
];

export function DashboardPage() {
  const { hasPermission } = useAuth();

  const quickActions = [
    { label: "Create User", icon: UserPlus, path: "/users/create", color: "bg-blue-600", permission: "users.create" },
    { label: "Create Role", icon: ShieldPlus, path: "/roles/create", color: "bg-purple-600", permission: "roles.create" },
    { label: "App Access Control", icon: ExternalLink, path: "/app-access", color: "bg-orange-600", permission: "portal.access" },
  ];

  return (
    <div className="space-y-8 font-sans">
      <PageHeader title="Dashboard Overview" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 px-1">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const hasActionPermission = !action.permission || hasPermission(action.permission);
              return (
                <Link
                  key={action.label}
                  to={hasActionPermission ? action.path : "#"}
                  onClick={(e) => !hasActionPermission && e.preventDefault()}
                  className={cn(
                    "flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl transition-all group",
                    hasActionPermission
                      ? "hover:border-blue-200 hover:bg-blue-50/30"
                      : "cursor-not-allowed opacity-60 bg-gray-50/50"
                  )}
                  title={hasActionPermission ? "" : "Permission Denied"}
                >
                  <div className={cn(
                    "text-white p-2.5 rounded-xl shadow-lg transition-transform",
                    hasActionPermission
                      ? `${action.color} shadow-blue-200 group-hover:scale-105`
                      : "bg-gray-300 shadow-none"
                  )}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "font-semibold transition-colors",
                    hasActionPermission
                      ? "text-gray-700 group-hover:text-blue-600"
                      : "text-gray-400"
                  )}>
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <Link to="/audit-logs" className="text-sm font-semibold text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        <span className="font-bold">{activity.user}</span> {activity.action}{" "}
                        <span className="font-bold">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                  <StatusBadge status="Completed" variant="success" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
