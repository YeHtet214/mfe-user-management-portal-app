import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { RoleForm, type RoleFormData } from "../../components/roles/RoleForm";
import { createRole } from "../../services/roleApi";

export function RoleCreatePage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string[]> | undefined>(undefined);

  const handleSubmit = async (data: RoleFormData) => {
    try {
      setErrors(undefined);
      await createRole(data);
      navigate("/roles");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error creating role:", error);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      <PageHeader
        title="Create New Role"
        breadcrumbs={[
          { label: "Role Management", path: "/roles" },
          { label: "Create Role" },
        ]}
      />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <RoleForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/roles")}
          externalErrors={errors}
        />
      </div>
    </div>
  );
}
