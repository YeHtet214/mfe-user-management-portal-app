import { PageHeader } from "../../components/layout/PageHeader";
import { DataTable } from "../../components/shared/DataTable";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { SearchInput } from "../../components/shared/SearchInput";
import { History, Filter, User, Shield, AppWindow, Calendar, Search, MoreVertical } from "lucide-react";
import { useState } from "react";

interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  module: "User" | "Role" | "App" | "Permission";
  dateTime: string;
  status: "Success" | "Failed";
}

const mockLogs: AuditLog[] = [
  { id: "1", actor: "Admin User", action: "Created User", target: "John Doe", module: "User", dateTime: "2024-03-15 10:30 AM", status: "Success" },
  { id: "2", actor: "Admin User", action: "Updated Role", target: "Manager", module: "Role", dateTime: "2024-03-15 09:15 AM", status: "Success" },
  { id: "3", actor: "System", action: "Granted Access", target: "Product App", module: "App", dateTime: "2024-03-14 04:45 PM", status: "Success" },
  { id: "4", actor: "Jane Smith", action: "Failed Login", target: "jane@example.com", module: "User", dateTime: "2024-03-14 02:20 PM", status: "Failed" },
  { id: "5", actor: "Admin User", action: "Deleted Role", target: "Intern", module: "Role", dateTime: "2024-03-14 11:10 AM", status: "Success" },
];

export function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    {
      header: "Actor",
      accessor: (row: AuditLog) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
            {row.actor.substring(0, 2)}
          </div>
          <span className="font-bold text-gray-900">{row.actor}</span>
        </div>
      ),
    },
    {
      header: "Action & Target",
      accessor: (row: AuditLog) => (
        <div className="space-y-1">
          <span className="font-semibold text-gray-800">{row.action}</span>
          <p className="text-xs text-gray-500 italic">Target: {row.target}</p>
        </div>
      ),
    },
    {
      header: "Module",
      accessor: (row: AuditLog) => {
        const icons = {
          User: <User className="w-3.5 h-3.5" />,
          Role: <Shield className="w-3.5 h-3.5" />,
          App: <AppWindow className="w-3.5 h-3.5" />,
          Permission: <History className="w-3.5 h-3.5" />,
        };
        return (
          <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-gray-600 font-bold text-[10px] uppercase tracking-wider">
            {icons[row.module]}
            {row.module}
          </div>
        );
      },
    },
    {
      header: "Date & Time",
      accessor: (row: AuditLog) => (
        <div className="flex items-center gap-2 text-gray-500 font-medium">
          <Calendar className="w-4 h-4" />
          {row.dateTime}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: AuditLog) => (
        <StatusBadge
          status={row.status}
          variant={row.status === "Success" ? "success" : "danger"}
        />
      ),
    },
    {
      header: "Actions",
      accessor: (row: AuditLog) => (
        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Search className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Audit Logs"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all">
            Export Logs
          </button>
        }
      />

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <SearchInput
            placeholder="Search by actor, action, or target..."
            containerClassName="sm:max-w-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <DataTable columns={columns as any} data={mockLogs} />
      </div>
      
      <div className="bg-blue-600 p-8 rounded-3xl shadow-lg shadow-blue-200 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-white tracking-tight">System Health Monitoring</h3>
            <p className="text-blue-100 text-sm font-medium">Logs are automatically retained for 90 days. For longer retention, please contact support.</p>
          </div>
          <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-md">
            View Analytics
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}
