import { AppWindow, Users, Shield } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatusBadge } from "../../components/shared/StatusBadge";

const apps = [
  {
    id: "portal",
    name: "Portal App",
    code: "PORTAL",
    description: "Main administration and user management platform",
    allowedRoles: ["Super Admin", "Manager"],
    userCount: 18,
    status: "Active",
  },
  {
    id: "product",
    name: "Product App",
    code: "PRODUCT",
    description: "Product catalog and inventory management system",
    allowedRoles: ["Super Admin", "Manager", "Viewer"],
    userCount: 45,
    status: "Active",
  },
  {
    id: "inventory",
    name: "Inventory App",
    code: "INVENTORY",
    description: "Warehouse and stock tracking application",
    allowedRoles: ["Super Admin", "Inventory Manager"],
    userCount: 12,
    status: "Inactive",
  },
];

export function AppAccessPage() {
  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="App Access Management"
        actions={
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all">
            Add New App
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div key={app.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-blue-600">
                  <AppWindow className="w-6 h-6" />
                </div>
                <StatusBadge
                  status={app.status}
                  variant={app.status === "Active" ? "success" : "danger"}
                />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900">{app.name}</h3>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{app.code}</p>
              <p className="text-sm text-gray-500 mt-3 line-clamp-2 min-h-[40px]">
                {app.description}
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>Users with access</span>
                  </div>
                  <span className="font-bold text-gray-900">{app.userCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>Allowed Roles</span>
                  </div>
                  <span className="font-bold text-gray-900">{app.allowedRoles.length}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {app.allowedRoles.map((role) => (
                  <span key={role} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100 uppercase">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Manage Access
              </button>
              <button className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
                Settings
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
