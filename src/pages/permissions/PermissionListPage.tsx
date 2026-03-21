import { PageHeader } from "../../components/layout/PageHeader";
import { Shield, Lock } from "lucide-react";
import { SearchInput } from "../../components/shared/SearchInput";
import { useState, useEffect } from "react";
import { fetchPermissions } from "../../services/permissionApi";
import type { PermissionGroup } from "../../services/types";

export function PermissionListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setLoading(true);
        const response = await fetchPermissions();
        setPermissionGroups(response.data);
      } catch (error) {
        console.error("Failed to load permissions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPermissions();
  }, []);

  const filteredGroups = permissionGroups.filter(group => 
    group.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.permissions.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Permission Management"
        actions={
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            Read Only View
          </div>
        }
      />

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <SearchInput
            placeholder="Search permissions by name or module..."
            containerClassName="sm:max-w-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="w-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filteredGroups.map((group) => (
              <div key={group.resource} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border border-gray-100">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{group.label}</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{group.resource}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {group.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{permission.name}</p>
                          <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mt-1">{permission.slug}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
