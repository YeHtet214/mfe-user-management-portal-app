import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { RoleForm, type RoleFormData } from "../../components/roles/RoleForm";
import { fetchRole, updateRole } from "../../services/roleApi";

export function RoleEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roleData, setRoleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string[]> | undefined>(undefined);

  useEffect(() => {
    const getRoleData = async () => {
      try {
        setIsLoading(true);
        const role = await fetchRole(Number(id));
        setRoleData(role);
      } catch (error) {
        console.error("Error fetching role data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      getRoleData();
    }
  }, [id]);

  const handleSubmit = async (data: RoleFormData) => {
    try {
      setErrors(undefined);
      await updateRole(Number(id), data);
      navigate("/roles");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error updating role:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      <PageHeader
        title="Edit Role"
        breadcrumbs={[
          { label: "Role Management", path: "/roles" },
          { label: "Edit Role" },
        ]}
      />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <RoleForm
          isEdit
          initialData={roleData}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/roles")}
          externalErrors={errors}
        />
      </div>
    </div>
  );
}
