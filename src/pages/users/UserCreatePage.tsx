import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { UserForm, type UserFormData } from "../../components/users/UserForm";
import { createUser } from "../../services/userApi";

export function UserCreatePage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string[]> | undefined>(undefined);

  const handleSubmit = async (data: UserFormData) => {
    try {
      setErrors(undefined);
      await createUser(data);
      navigate("/users");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error creating user:", error);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      <PageHeader
        title="Create New User"
        breadcrumbs={[
          { label: "User Management", path: "/users" },
          { label: "Create User" },
        ]}
      />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <UserForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/users")}
          externalErrors={errors}
        />
      </div>
    </div>
  );
}
